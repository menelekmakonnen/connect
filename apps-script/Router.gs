// ============================================
// ICUNI Connect - Main Router
// ============================================

/**
 * Main GET handler - Entry point for all GET requests
 */
function doGet(e) {
  return route(e, 'GET');
}

/**
 * Main POST handler - Entry point for all POST/PATCH requests
 */ 
function doPost(e) {
  return route(e, 'POST');
}

/**
 * OPTIONS handler for CORS preflight
 */
function doOptions(e) {
  return createResponse({ ok: true });
}

/**
 * Main routing function
 */
function route(e, method) {
  try {
    // Handle OPTIONS for CORS
    if (method === 'OPTIONS') {
      return createResponse({ ok: true });
    }

    // Parse path and parameters
    // CRITICAL FIX: Apps Script Web Apps don't populate e.pathInfo from URL segments
    // So we accept the path as a query parameter: ?path=/api/talents
    const params = e.parameter || {};
    const path = params.path || e.pathInfo || '/';
    const body = e.postData ? JSON.parse(e.postData.contents) : {};
    
    // Extract method from body if present (for PATCH/DELETE via POST)
    const actualMethod = body._method || method;
    
    Logger.log(`${actualMethod} ${path}`);

    // Route to appropriate handler
    const segments = path.split('/').filter(s => s);
    
    if (!segments.length || segments[0] !== 'api') {
      return createErrorResponse('Invalid API path', 404);
    }

    const resource = segments[1];
    const id = segments[2];
    const subResource = segments[3];

    // Auth endpoints
    if (resource === 'auth') {
      if (id === 'google' && actualMethod === 'POST') {
        return createResponse(authGoogle(body));
      }
    }

    // Me endpoint
    if (resource === 'me' && actualMethod === 'GET') {
      const user = requireAuth(e);
      return createResponse({ ok: true, data: user });
    }

    // Talents endpoints
    if (resource === 'talents') {
      if (!id && actualMethod === 'GET') {
        return createResponse(searchTalents(params));
      }
      if (!id && actualMethod === 'POST') {
        requireAuth(e);
        return createResponse(createTalent(body));
      }
      if (id && actualMethod === 'GET') {
        return createResponse(getTalentById(id, e));
      }
      if (id && actualMethod === 'PATCH') {
        requireAuth(e);
        return createResponse(updateTalent(id, body));
      }
      if (id && subResource === 'links' && actualMethod === 'POST') {
        requireAuth(e);
        return createResponse(addTalentLink(id, body));
      }
      if (id && subResource === 'rates' && actualMethod === 'POST') {
        requireAuth(e);
        return createResponse(upsertTalentRates(id, body));
      }
      if (id && subResource === 'claim' && actualMethod === 'POST') {
        const user = requireAuth(e);
        return createResponse(claimTalentProfile(id, user.user_id));
      }
    }

    // Projects endpoints
    if (resource === 'projects') {
      if (id === 'my' && actualMethod === 'GET') {
        const user = requireAuth(e);
        return createResponse(getUserProjects(user.user_id, params));
      }
      if (!id && actualMethod === 'GET') {
        // MVP: Allow public access to projects list
        // const user = requireAuth(e);
        // return createResponse(getUserProjects(user.user_id, params));
        return createResponse(getAllProjects(params));
      }
      if (!id && actualMethod === 'POST') {
        const user = requireAuth(e);
        return createResponse(createProject(body, user.user_id));
      }
      if (id && actualMethod === 'GET') {
        // MVP: Allow public access to project details
        // requireAuth(e);
        return createResponse(getProjectById(id));
      }
      if (id && actualMethod === 'PATCH') {
        requireAuth(e);
        return createResponse(updateProject(id, body));
      }
      if (id && subResource === 'roleslots' && actualMethod === 'POST') {
        requireAuth(e);
        return createResponse(addRoleSlot(id, body));
      }
      if (id && subResource === 'lineup') {
        if (segments[4] === 'add' && actualMethod === 'POST') {
          requireAuth(e);
          return createResponse(addToLineup(id, body));
        }
        if (segments[4] === 'remove' && actualMethod === 'POST') {
          requireAuth(e);
          return createResponse(removeFromLineup(id, body));
        }
      }
      if (id && subResource === 'requests' && segments[4] === 'send' && actualMethod === 'POST') {
        const user = requireAuth(e);
        return createResponse(sendRequests(id, body, user));
      }
    }

    // Requests endpoints
    if (resource === 'requests') {
      if (segments[2] === 'inbox' && actualMethod === 'GET') {
        const user = requireAuth(e);
        return createResponse(getTalentInbox(user.user_id));
      }
      if (id && actualMethod === 'GET') {
        requireAuth(e);
        return createResponse(getRequestById(id));
      }
      if (id && subResource === 'respond' && actualMethod === 'POST') {
        return createResponse(respondToRequest(id, body));
      }
      if (id && subResource === 'dealmemo' && actualMethod === 'POST') {
        requireAuth(e);
        return createResponse(generateDealMemo(id));
      }
    }

    // Assets endpoints
    if (resource === 'assets') {
      if (subResource === 'upload' && actualMethod === 'POST') {
        const user = requireAuth(e);
        const { dataUrl, type, category } = body;
        return createResponse(uploadUserFile(user.user_id, dataUrl, type, category));
      }
    }

    // Shortlists endpoints
    if (resource === 'shortlists') {
      if (!id && actualMethod === 'GET') {
        const user = requireAuth(e);
        return createResponse(getUserShortlists(user.user_id));
      }
      if (!id && actualMethod === 'POST') {
        const user = requireAuth(e);
        const { name } = body;
        return createResponse(createShortlist(user.user_id, name));
      }
      if (id && actualMethod === 'DELETE') {
        const user = requireAuth(e);
        return createResponse(deleteShortlist(id, user.user_id));
      }
      if (id && subResource === 'add' && actualMethod === 'POST') {
        const user = requireAuth(e);
        const { talent_id } = body;
        return createResponse(addTalentToShortlist(id, talent_id, user.user_id));
      }
      if (id && subResource === 'remove' && actualMethod === 'POST') {
        const user = requireAuth(e);
        const { talent_id } = body;
        return createResponse(removeTalentFromShortlist(id, talent_id, user.user_id));
      }
    }

    // If no route matched
    return createErrorResponse('Endpoint not found', 404);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log(error.stack);
    return createErrorResponse(error.toString(), 500);
  }
}

/**
 * Create a successful JSON response
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create an error response
 */
function createErrorResponse(message, statusCode = 400) {
  const response = {
    ok: false,
    error: message,
    statusCode: statusCode
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

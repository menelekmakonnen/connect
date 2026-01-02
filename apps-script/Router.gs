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
    var params = e.parameter || {};
    var path = params.path || e.pathInfo || '/';
    var body = {};
    
    try {
      body = e.postData ? JSON.parse(e.postData.contents) : {};
    } catch (parseError) {
      Logger.log('Body parse error: ' + parseError.toString());
    }
    
    // Extract method from body if present (for PATCH/DELETE via POST)
    var actualMethod = (body._method || method).toUpperCase();
    
    Logger.log('Processing: ' + actualMethod + ' ' + path);

    // Route to appropriate handler
    var segments = path.split('/').filter(function(s) { return s && s.trim(); });
    
    if (!segments.length || segments[0] !== 'api') {
      Logger.log('Invalid API path: ' + path);
      return createErrorResponse('Invalid API path: ' + path, 404);
    }

    var resource = segments[1] ? segments[1].toLowerCase() : '';
    var id = segments[2] ? segments[2].trim() : '';
    var subResource = segments[3] ? segments[3].toLowerCase() : '';

    Logger.log('Resource: ' + resource + ', ID: ' + id + ', Sub: ' + subResource);

    // Auth endpoints
    if (resource === 'auth') {
      if (id === 'google' && actualMethod === 'POST') {
        return createResponse(authGoogle(body));
      }
    }

    // Me endpoint
    if (resource === 'me' && actualMethod === 'GET') {
      var user = requireAuth(e);
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
        var user_claim = requireAuth(e);
        return createResponse(claimTalentProfile(id, user_claim.user_id));
      }
    }

    // Projects endpoints
    if (resource === 'projects') {
      Logger.log('Handling Projects: id=' + id + ', method=' + actualMethod);
      
      if (id === 'my' && actualMethod === 'GET') {
        var user_projects = requireAuth(e);
        Logger.log('Calling getUserProjects for user: ' + user_projects.user_id);
        return createResponse(getUserProjects(user_projects.user_id, params));
      }
      if (!id && actualMethod === 'GET') {
        return createResponse(getAllProjects(params));
      }
      if (!id && actualMethod === 'POST') {
        var user_create = requireAuth(e);
        return createResponse(createProject(body, user_create.user_id));
      }
      if (id && actualMethod === 'GET') {
        Logger.log('Calling getProjectById for ID: ' + id);
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
        var user_req = requireAuth(e);
        return createResponse(sendRequests(id, body, user_req));
      }
    }

    // Requests endpoints
    if (resource === 'requests') {
      if (segments[2] === 'inbox' && actualMethod === 'GET') {
        var user_inbox = requireAuth(e);
        return createResponse(getTalentInbox(user_inbox.user_id));
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
        var user_asset = requireAuth(e);
        var dataUrl = body.dataUrl;
        var type = body.type;
        var category = body.category;
        return createResponse(uploadUserFile(user_asset.user_id, dataUrl, type, category));
      }
    }

    // Shortlists endpoints
    if (resource === 'shortlists') {
      if (!id && actualMethod === 'GET') {
        var user_s_list = requireAuth(e);
        return createResponse(getUserShortlists(user_s_list.user_id));
      }
      if (!id && actualMethod === 'POST') {
        var user_s_create = requireAuth(e);
        var s_name = body.name;
        return createResponse(createShortlist(user_s_create.user_id, s_name));
      }
      if (id && actualMethod === 'DELETE') {
        var user_s_del = requireAuth(e);
        return createResponse(deleteShortlist(id, user_s_del.user_id));
      }
      if (id && subResource === 'add' && actualMethod === 'POST') {
        var user_s_add = requireAuth(e);
        var t_id_add = body.talent_id;
        return createResponse(addTalentToShortlist(id, t_id_add, user_s_add.user_id));
      }
      if (id && subResource === 'remove' && actualMethod === 'POST') {
        var user_s_rem = requireAuth(e);
        var t_id_rem = body.talent_id;
        return createResponse(removeTalentFromShortlist(id, t_id_rem, user_s_rem.user_id));
      }
    }

    Logger.log('No route matched for: ' + resource + '/' + id + '/' + subResource);
    return createErrorResponse('Endpoint not found: ' + resource + '/' + id, 404);

  } catch (error) {
    Logger.log('Router Error: ' + error.toString());
    if (error.stack) Logger.log(error.stack);
    return createErrorResponse(error.toString(), 500);
  }
}

/**
 * Create a successful JSON response
 */
function createResponse(data) {
  // Add version tag for diagnostics
  if (data && typeof data === 'object') {
    data.v = 'ICUNI-1.0.1';
  }
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create an error response
 */
function createErrorResponse(message, statusCode) {
  var response = {
    ok: false,
    error: message,
    statusCode: statusCode || 400
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

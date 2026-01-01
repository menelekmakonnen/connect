// ============================================
// ICUNI Connect - Requests API (The Money Maker!)
// ============================================

/**
 * Send requests (holds) to talent
 */
function sendRequests(projectId, data, user) {
  try {
    const { requests } = data; // Array of { lineup_id, slot_id, talent_id, offer_fee, message }
    
    const project = dbFindOne(TABLES.PROJECTS, { project_id: projectId });
    
    if (!project) {
      return { ok: false, error: 'Project not found' };
    }
    
    // Check ownership
    if (project.owner_user_id !== user.user_id) {
      return { ok: false, error: 'You do not own this project' };
    }
    
    const sentRequests = [];
    
    requests.forEach(requestData => {
      const requestId = generateRequestId();
      
      const request = {
        request_id: requestId,
        project_id: projectId,
        slot_id: requestData.slot_id,
        talent_id: requestData.talent_id,
        lineup_id: requestData.lineup_id || '',
        sent_by_user_id: user.user_id,
        offer_fee: requestData.offer_fee || '',
        includes: requestData.includes || '',
        excludes: requestData.excludes || '',
        message: requestData.message || '',
        status: 'sent',
        sent_at: getTimestamp(),
        response_at: '',
        response_type: '',
        response_message: '',
        counter_fee: '',
        created_at: getTimestamp(),
        updated_at: getTimestamp()
      };
      
      dbInsert(TABLES.REQUESTS, request);
      sentRequests.push(request);
      
      // Update lineup status to 'invited'
      if (requestData.lineup_id) {
        dbUpdate(TABLES.LINEUP, { lineup_id: requestData.lineup_id }, {
          lineup_status: 'invited'
        });
      }
      
      // Send email notification (placeholder - implement later)
      // sendRequestEmail(request);
    });
    
    // Update project status
    if (project.status === 'staffing' || project.status === 'draft') {
      dbUpdate(TABLES.PROJECTS, { project_id: projectId }, { 
        status: 'requests_sent' 
      });
    }
    
    return { ok: true, data: { sent: sentRequests.length, requests: sentRequests } };
    
  } catch (error) {
    Logger.log('Send requests error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Get talent inbox (requests sent to this talent)
 */
function getTalentInbox(userId) {
  try {
    // Find talent profile for this user
    const talent = dbFindOne(TABLES.TALENTS, { user_id: userId });
    
    if (!talent) {
      return { ok: true, data: [] }; // No talent profile = no requests
    }
    
    // Get requests
    const requests = dbSelect(TABLES.REQUESTS, { talent_id: talent.talent_id });
    
    // Filter to active requests only
    const activeRequests = requests.filter(r => 
      r.status === 'sent' || r.status === 'viewed' || r.status === 'question'
    );
    
    // Enrich with project and role info
    const enrichedRequests = activeRequests.map(req => {
      const project = dbFindOne(TABLES.PROJECTS, { project_id: req.project_id });
      const slot = dbFindOne(TABLES.ROLE_SLOTS, { slot_id: req.slot_id });
      const pm = dbFindOne(TABLES.USERS, { user_id: req.sent_by_user_id });
      
      // Get other lineup members for this project (team preview)
      const lineup = dbSelect(TABLES.LINEUP, { project_id: req.project_id });
      const teamPreview = lineup
        .filter(l => l.talent_id !== talent.talent_id && l.lineup_status === 'accepted')
        .slice(0, 3)
        .map(l => {
          const t = dbFindOne(TABLES.TALENTS, { talent_id: l.talent_id });
          const s = dbFindOne(TABLES.ROLE_SLOTS, { slot_id: l.slot_id });
          return t && s ? `${t.display_name} (${s.role_name})` : '';
        })
        .filter(t => t);
      
      return {
        request_id: req.request_id,
        project_title: project?.title || '',
        project_type: project?.type || '',
        role_name: slot?.role_name || '',
        offer_fee: req.offer_fee,
        currency: 'GHS', // Default
        start_date: project?.start_date || '',
        location_city: project?.location_city || '',
        sent_at: req.sent_at,
        status: req.status,
        pm_name: pm?.display_name || project?.client_name || '',
        team_preview: teamPreview,
        message: req.message
      };
    });
    
    // Sort by sent_at desc
    enrichedRequests.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
    
    return { ok: true, data: enrichedRequests };
    
  } catch (error) {
    Logger.log('Get inbox error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Get request by ID with full details
 */
function getRequestById(requestId) {
  try {
    const request = dbFindOne(TABLES.REQUESTS, { request_id: requestId });
    
    if (!request) {
      return { ok: false, error: 'Request not found' };
    }
    
    const project = dbFindOne(TABLES.PROJECTS, { project_id: request.project_id });
    const slot = dbFindOne(TABLES.ROLE_SLOTS, { slot_id: request.slot_id });
    const talent = dbFindOne(TABLES.TALENTS, { talent_id: request.talent_id });
    const pm = dbFindOne(TABLES.USERS, { user_id: request.sent_by_user_id });
    
    return {
      ok: true,
      data: {
        ...request,
        project: project,
        role_slot: slot,
        talent: talent,
        sent_by: pm
      }
    };
    
  } catch (error) {
    Logger.log('Get request error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Respond to a request
 */
function respondToRequest(requestId, data) {
  try {
    const { response_type, message = '', counter_fee = '' } = data;
    
    const request = dbFindOne(TABLES.REQUESTS, { request_id: requestId });
    
    if (!request) {
      return { ok: false, error: 'Request not found' };
    }
    
    // Valid response types: accept, decline, question, counter
    if (!['accept', 'decline', 'question', 'counter'].includes(response_type)) {
      return { ok: false, error: 'Invalid response type' };
    }
    
    // Update request
    const updates = {
      response_type: response_type,
      response_message: message,
      response_at: getTimestamp(),
      updated_at: getTimestamp()
    };
    
    // Update status based on response
    if (response_type === 'accept') {
      updates.status = 'accepted';
      updates.counter_fee = ''; // Clear any counter
    } else if (response_type === 'decline') {
      updates.status = 'declined';
    } else if (response_type === 'question') {
      updates.status = 'question';
    } else if (response_type === 'counter') {
      updates.status = 'countered';
      updates.counter_fee = counter_fee;
    }
    
    dbUpdate(TABLES.REQUESTS, { request_id: requestId }, updates);
    
    // Update lineup status
    if (request.lineup_id) {
      let lineupStatus = 'invited';
      
      if (response_type === 'accept') {
        lineupStatus = 'accepted';
      } else if (response_type === 'decline') {
        lineupStatus = 'declined';
      } else if (response_type === 'counter') {
        lineupStatus = 'negotiating';
      }
      
      dbUpdate(TABLES.LINEUP, { lineup_id: request.lineup_id }, {
        lineup_status: lineupStatus
      });
    }
    
    // Send notification email to PM (placeholder)
    // sendResponseEmail(request, response_type);
    
    return { ok: true, data: { request_id: requestId, response_type: response_type } };
    
  } catch (error) {
    Logger.log('Respond to request error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Generate deal memo PDF (placeholder)
 */
function generateDealMemo(requestId) {
  try {
    const request = dbFindOne(TABLES.REQUESTS, { request_id: requestId });
    
    if (!request) {
      return { ok: false, error: 'Request not found' };
    }
    
    if (request.status !== 'accepted') {
      return { ok: false, error: 'Request must be accepted to generate deal memo' };
    }
    
    // TODO: Implement Google Docs template generation
    // For now, return placeholder
    
    return {
      ok: true,
      data: {
        message: 'Deal memo generation not yet implemented',
        request_id: requestId
      }
    };
    
  } catch (error) {
    Logger.log('Generate deal memo error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Create a thread for request discussion
 */
function createRequestThread(requestId, userId) {
  try {
    const threadId = `THRD_${requestId}`;
    
    const thread = {
      thread_id: threadId,
      request_id: requestId,
      created_by_user_id: userId,
      created_at: getTimestamp()
    };
    
    dbInsert(TABLES.THREADS, thread);
    
    return { ok: true, data: thread };
    
  } catch (error) {
    Logger.log('Create thread error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

// ============================================
// ICUNI Connect - Projects API
// ============================================

/**
 * Get all projects (MVP: public access) - OPTIMIZED
 */
function getAllProjects(params) {
  try {
    const { status = '', type = '', admin_view = 'false' } = params;
    
    let projects = CacheUtils.getOrSet('ALL_PROJECTS_RAW', function() {
        return dbSelect(TABLES.PROJECTS, {});
    });
    
    // Filter by visibility (default to public only for non-admin/guest view)
    if (admin_view !== 'true') {
      projects = projects.filter(p => p.public_private === 'public');
    }
    
    // Filter by status
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    
    // Filter by type
    if (type) {
      projects = projects.filter(p => p.type === type);
    }
    
    // Sort by created_at desc
    projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // OPTIMIZATION: Batch load all related data once
    const allSlots = CacheUtils.getOrSet('ALL_ROLE_SLOTS_RAW', function() {
        return dbSelectAll(TABLES.ROLE_SLOTS);
    });
    const allLineup = CacheUtils.getOrSet('ALL_LINEUP_RAW', function() {
        return dbSelectAll(TABLES.LINEUP);
    });
    const allRequests = CacheUtils.getOrSet('ALL_REQUESTS_RAW', function() {
        return dbSelectAll(TABLES.REQUESTS);
    });
    
    // Create lookup maps by project_id
    const slotsByProject = {};
    const lineupByProject = {};
    const requestsByProject = {};
    
    allSlots.forEach(slot => {
      if (!slotsByProject[slot.project_id]) slotsByProject[slot.project_id] = [];
      slotsByProject[slot.project_id].push(slot);
    });
    
    allLineup.forEach(entry => {
      if (!lineupByProject[entry.project_id]) lineupByProject[entry.project_id] = [];
      lineupByProject[entry.project_id].push(entry);
    });
    
    allRequests.forEach(req => {
      if (!requestsByProject[req.project_id]) requestsByProject[req.project_id] = [];
      requestsByProject[req.project_id].push(req);
    });
    
    // Enrich with stats using pre-loaded data
    const enriched = projects.map(p => {
      const slots = slotsByProject[p.project_id] || [];
      const lineup = lineupByProject[p.project_id] || [];
      const requests = requestsByProject[p.project_id] || [];
      
      const pendingRequests = requests.filter(r => r.status === 'sent' || r.status === 'viewed');
      
      return {
        project_id: p.project_id,
        title: p.title,
        type: p.type,
        status: p.status,
        start_date: p.start_date,
        location_city: p.location_city,
        budget_tier: p.budget_tier,
        public_private: p.public_private || 'public',
        slots_count: slots.length,
        lineup_count: lineup.filter(l => l.lineup_status === 'accepted' || l.lineup_status === 'locked').length,
        pending_requests: pendingRequests.length
      };
    });
    
    return { ok: true, data: enriched };
    
  } catch (error) {
    Logger.log('Get all projects error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Get user's projects
 */
function getUserProjects(userId, params) {
  try {
    const { status = '', type = '' } = params;
    
    let projects = dbSelect(TABLES.PROJECTS, { owner_user_id: userId });
    
    // Filter by status
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    
    // Filter by type
    if (type) {
      projects = projects.filter(p => p.type === type);
    }
    
    // Sort by created_at desc
    projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Enrich with stats
    const enriched = projects.map(p => enrichProjectSummary(p));
    
    return { ok: true, data: enriched };
    
  } catch (error) {
    Logger.log('Get projects error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Enrich project with slots and lineup counts
 */
function enrichProjectSummary(project) {
  const slots = dbSelect(TABLES.ROLE_SLOTS, { project_id: project.project_id });
  const lineup = dbSelect(TABLES.LINEUP, { project_id: project.project_id });
  const requests = dbSelect(TABLES.REQUESTS, { project_id: project.project_id });
  
  const pendingRequests = requests.filter(r => r.status === 'sent' || r.status === 'viewed');
  
  return {
    project_id: project.project_id,
    title: project.title,
    type: project.type,
    status: project.status,
    start_date: project.start_date,
    location_city: project.location_city,
    budget_tier: project.budget_tier,
    public_private: project.public_private || 'private',
    slots_count: slots.length,
    lineup_count: lineup.filter(l => l.lineup_status === 'accepted' || l.lineup_status === 'locked').length,
    pending_requests: pendingRequests.length
  };
}

/**
 * Get project by ID with full details
 */
function getProjectById(projectId) {
  try {
    const cached = CacheUtils.get('PROJECT_' + projectId);
    if (cached) return cached;

    const project = dbFindOne(TABLES.PROJECTS, { project_id: projectId });
    
    if (!project) {
      return { ok: false, error: 'Project not found' };
    }
    
    // Get role slots
    const slots = dbSelect(TABLES.ROLE_SLOTS, { project_id: projectId });
    
    // Get lineup for each slot
    const slotsWithLineup = slots.map(slot => {
      const lineupEntries = dbSelect(TABLES.LINEUP, { slot_id: slot.slot_id });
      
      // Enrich lineup with talent info
      const enrichedLineup = lineupEntries.map(lineup => {
        const talent = dbFindOne(TABLES.TALENTS, { talent_id: lineup.talent_id });
        return {
          ...lineup,
          talent: talent ? {
            talent_id: talent.talent_id,
            display_name: talent.display_name,
            profile_photo_url: talent.profile_photo_url
          } : null
        };
      });
      
      return {
        ...slot,
        lineup: enrichedLineup
      };
    });
    


    CacheUtils.set('PROJECT_' + projectId, { ok: true, data: { ...project, role_slots: slotsWithLineup } });
    return { ok: true, data: { ...project, role_slots: slotsWithLineup } };
    
  } catch (error) {
    Logger.log('Get project error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Create a new project
 */
function createProject(data, userId) {
  try {
    const projectId = generateProjectId();
    
    const project = {
      project_id: projectId,
      owner_user_id: userId,
      title: data.title,
      type: data.type,
      status: 'draft',
      start_date: data.start_date || '',
      end_date: data.end_date || '',
      location_city: data.location_city || '',
      location_notes: data.location_notes || '',
      brief: data.brief || '',
      budget_tier: data.budget_tier || 'mid',
      client_name: data.client_name || '',
      public_private: 'private', // Default to private as requested
      created_at: getTimestamp(),
      updated_at: getTimestamp()
    };
    
    dbInsert(TABLES.PROJECTS, project);
    CacheUtils.remove('ALL_PROJECTS_RAW');
    
    // If role_slots provided, create them
    if (data.role_slots && Array.isArray(data.role_slots)) {
      data.role_slots.forEach(slotData => {
        addRoleSlot(projectId, slotData);
      });
    }
    
    return { ok: true, data: { project_id: projectId } };
    
  } catch (error) {
    Logger.log('Create project error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Update project
 */
function updateProject(projectId, updates) {
  try {
    updates.updated_at = getTimestamp();
    dbUpdate(TABLES.PROJECTS, { project_id: projectId }, updates);
    CacheUtils.remove('ALL_PROJECTS_RAW');
    CacheUtils.remove('PROJECT_' + projectId);
    
    return { ok: true, data: { project_id: projectId } };
    
  } catch (error) {
    Logger.log('Update project error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Add a role slot to project
 */
function addRoleSlot(projectId, slotData) {
  try {
    const slotId = generateSlotId();
    
    const slot = {
      slot_id: slotId,
      project_id: projectId,
      role_name: slotData.role_name,
      role_category: slotData.role_category || '',
      qty: slotData.qty || 1,
      requirements: slotData.requirements || '',
      target_fee: slotData.target_fee || '',
      created_at: getTimestamp()
    };
    
    dbInsert(TABLES.ROLE_SLOTS, slot);
    CacheUtils.remove('ALL_ROLE_SLOTS_RAW');
    CacheUtils.remove('PROJECT_' + projectId);
    
    return { ok: true, data: slot };
    
  } catch (error) {
    Logger.log('Add role slot error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Add talent to lineup
 */
function addToLineup(projectId, data) {
  try {
    const { slot_id, talent_id } = data;
    
    // Check if already in lineup for this slot
    const existing = dbFindOne(TABLES.LINEUP, { 
      project_id: projectId,
      slot_id: slot_id,
      talent_id: talent_id
    });
    
    if (existing) {
      return { ok: false, error: 'Talent already in lineup for this role' };
    }
    
    const lineupId = generateLineupId();
    
    const lineup = {
      lineup_id: lineupId,
      project_id: projectId,
      slot_id: slot_id,
      talent_id: talent_id,
      lineup_status: data.lineup_status || 'shortlisted',
      added_at: getTimestamp()
    };
    
    dbInsert(TABLES.LINEUP, lineup);
    CacheUtils.remove('ALL_LINEUP_RAW');
    CacheUtils.remove('PROJECT_' + projectId);
    
    return { ok: true, data: lineup };
    
  } catch (error) {
    Logger.log('Add to lineup error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

/**
 * Remove talent from lineup
 */
function removeFromLineup(projectId, data) {
  try {
    const { lineup_id } = data;
    
    dbUpdate(TABLES.LINEUP, { 
      lineup_id: lineup_id,
      project_id: projectId
    }, { 
      lineup_status: 'removed'
    });
    CacheUtils.remove('ALL_LINEUP_RAW');
    CacheUtils.remove('PROJECT_' + projectId);
    
    return { ok: true, data: { lineup_id: lineup_id } };
    
  } catch (error) {
    Logger.log('Remove from lineup error: ' + error.toString());
    return { ok: false, error: error.toString() };
  }
}

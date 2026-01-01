// ============================================
// ICUNI Connect - Shortlists Management
// ============================================

/**
 * Get all shortlists for a user
 */
function getUserShortlists(userId) {
  try {
    const shortlists = dbSelect(TABLES.SHORTLISTS, { user_id: userId, deleted: false });
    
    // Parse the talents JSON string back to object
    return shortlists.map(list => {
      let talentList = [];
      try {
        talentList = list.talents ? JSON.parse(list.talents) : [];
      } catch (e) {
        Logger.log('Error parsing shortlist talents: ' + e);
      }
      return {
        ...list,
        talents: talentList,
        talent_count: talentList.length
      };
    });
  } catch (error) {
    Logger.log('Error getting user shortlists: ' + error);
    return [];
  }
}

/**
 * Create a new shortlist
 */
function createShortlist(userId, name) {
  try {
    const id = 'SL_' + generateUniqueId();
    const newList = {
      id: id,
      user_id: userId,
      name: name,
      talents: '[]', // Store as JSON string
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false
    };
    
    dbInsert(TABLES.SHORTLISTS, newList);
    
    return { ok: true, data: newList };
  } catch (error) {
    Logger.log('Error creating shortlist: ' + error);
    return { ok: false, error: error.toString() };
  }
}

/**
 * Add a talent to a shortlist
 */
function addTalentToShortlist(shortlistId, talentId, userId) {
  try {
    const list = dbFindOne(TABLES.SHORTLISTS, { id: shortlistId, user_id: userId });
    
    if (!list) {
      return { ok: false, error: 'Shortlist not found' };
    }
    
    let talents = [];
    try {
      talents = JSON.parse(list.talents || '[]');
    } catch (e) {
      talents = [];
    }
    
    // Check if already exists
    if (talents.includes(talentId)) {
       return { ok: true, data: list }; // Idempotent success
    }
    
    talents.push(talentId);
    
    const updates = {
      talents: JSON.stringify(talents),
      updated_at: new Date().toISOString()
    };
    
    dbUpdate(TABLES.SHORTLISTS, { id: shortlistId }, updates);
    
    return { ok: true, data: { ...list, talents: talents } };
    
  } catch (error) {
    Logger.log('Error adding talent to shortlist: ' + error);
    return { ok: false, error: error.toString() };
  }
}

/**
 * Remove a talent from a shortlist
 */
function removeTalentFromShortlist(shortlistId, talentId, userId) {
  try {
    const list = dbFindOne(TABLES.SHORTLISTS, { id: shortlistId, user_id: userId });
    
    if (!list) {
      return { ok: false, error: 'Shortlist not found' };
    }
    
    let talents = [];
    try {
      talents = JSON.parse(list.talents || '[]');
    } catch (e) {
      talents = [];
    }
    
    const newTalents = talents.filter(id => id !== talentId);
    
    const updates = {
      talents: JSON.stringify(newTalents),
      updated_at: new Date().toISOString()
    };
    
    dbUpdate(TABLES.SHORTLISTS, { id: shortlistId }, updates);
    
    return { ok: true, data: { ...list, talents: newTalents } };
    
  } catch (error) {
    Logger.log('Error removing talent from shortlist: ' + error);
    return { ok: false, error: error.toString() };
  }
}

/**
 * Delete a shortlist
 */
function deleteShortlist(shortlistId, userId) {
  try {
    // Verify ownership
    const list = dbFindOne(TABLES.SHORTLISTS, { id: shortlistId, user_id: userId });
    
    if (!list) {
      return { ok: false, error: 'Shortlist not found' };
    }

    dbUpdate(TABLES.SHORTLISTS, { id: shortlistId }, { deleted: true });
    
    return { ok: true };
  } catch (error) {
     Logger.log('Error deleting shortlist: ' + error);
     return { ok: false, error: error.toString() };
  }
}

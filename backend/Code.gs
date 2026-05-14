/**
 * ICUNI CONNECT — Route Handler (Code.gs)
 * Apps Script Web App entry point.
 */

function doGet(e) {
  var route = (e && e.parameter && e.parameter.route) || 'status';
  try {
    switch (route) {
      case 'status':
        return jsonResponse_({ status: 'ok', app: 'ICUNI Connect', version: '2.0.0', architecture: '4-spreadsheet' });
      case 'publicResponse':
        return jsonResponse_(handlePublicResponse_(e.parameter));
      default:
        return jsonResponse_({ error: 'Unknown GET route: ' + route }, 404);
    }
  } catch (err) {
    return jsonResponse_({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    if (!action) return jsonResponse_({ error: 'Missing action' }, 400);

    // Public actions (no auth)
    if (action === 'login') return jsonResponse_(handleLogin_(body));
    if (action === 'register') return jsonResponse_(handleLogin_({ identifier: body.identifier, name: body.name, action: 'register' }));
    if (action === 'setPin') return jsonResponse_(handleSetPin_(body));
    if (action === 'requestsRespond') return jsonResponse_(handlePublicResponse_(body));

    // Admin init (no auth required on first run)
    if (action === 'adminInit') return jsonResponse_({ data: initializeAll_() });
    if (action === 'adminSeedRoles') return jsonResponse_({ data: seedRolesDictionary_() });
    if (action === 'adminSeedAll') return jsonResponse_({ data: seedAllData_() });

    // Auth-protected actions
    var token = body.token || '';
    var user = validateSession_(token);
    if (!user) return jsonResponse_({ error: 'Unauthorized — invalid or expired session' }, 401);

    switch (action) {
      case 'changePin':       return jsonResponse_({ data: handleChangePin_(body, user) });
      case 'talentsSearch':   return jsonResponse_({ data: searchTalents_(body, user) });
      case 'talentsGet':      return jsonResponse_({ data: getTalent_(body.id, user) });
      case 'talentsCreate':   return jsonResponse_({ data: createTalent_(body, user) });
      case 'talentsUpdate':   return jsonResponse_({ data: updateTalent_(body, user) });
      case 'talentsDelete':   return jsonResponse_({ data: deleteTalent_(body, user) });

      case 'projectsList':    return jsonResponse_({ data: listProjects_(body, user) });
      case 'projectsGet':     return jsonResponse_({ data: getProject_(body.id, user) });
      case 'projectsCreate':  return jsonResponse_({ data: createProject_(body, user) });
      case 'projectsUpdate':  return jsonResponse_({ data: updateProject_(body, user) });

      case 'rolesList':       return jsonResponse_({ data: listRoles_() });
      case 'configGet':       return jsonResponse_({ data: getConfig_() });
      case 'analyticsGet':    return jsonResponse_({ data: getAnalytics_(body, user) });

      case 'notificationsList': return jsonResponse_({ data: listNotifications_(user) });
      case 'notificationsRead': return jsonResponse_({ data: markNotificationRead_(body.id, user) });

      case 'userProfile':     return jsonResponse_({ data: getUserProfile_(user) });
      case 'profileUpdate':   return jsonResponse_({ data: updateUserProfile_(body, user) });

      case 'requestsList':    return jsonResponse_({ data: listRequests_(body, user) });
      case 'requestsGet':     return jsonResponse_({ data: getRequest_(body.id, user) });
      case 'requestsCreate':  return jsonResponse_({ data: createRequest_(body, user) });
      case 'requestsSend':    return jsonResponse_({ data: sendRequest_(body, user) });

      default:
        return jsonResponse_({ error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    logError_('doPost', err);
    return jsonResponse_({ error: err.message }, 500);
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Controller stubs (replaced by actual implementations as built) ──

function searchTalents_(body, user) {
  var talents = sheetToObjects_('Talents', COL.TALENTS);
  var q = (body.query || '').toLowerCase();
  if (q) {
    talents = talents.filter(function(t) {
      return t.DISPLAY_NAME.toLowerCase().indexOf(q) !== -1 ||
             t.LOCATION_LABEL.toLowerCase().indexOf(q) !== -1 ||
             t.BIO.toLowerCase().indexOf(q) !== -1;
    });
  }
  // Enrich with roles
  var allRoles = sheetToObjects_('TalentRoles', COL.TALENT_ROLES);
  var allPresence = sheetToObjects_('TalentPresence', COL.TALENT_PRESENCE);
  return talents.filter(function(t) { return t.STATUS === 'active' && t.PUBLIC_PROFILE === true; }).map(function(t) {
    var roles = allRoles.filter(function(r) { return r.TALENT_ID === t.ID; });
    var presence = allPresence.filter(function(p) { return p.TALENT_ID === t.ID; });
    return {
      id: t.ID, name: t.DISPLAY_NAME, location: t.LOCATION_LABEL,
      bio: t.BIO, availability: t.AVAILABILITY_STATUS,
      tier: t.VERIFICATION_TIER, avatar: t.PROFILE_IMAGE_FILE_ID,
      languages: t.LANGUAGES, travel: t.TRAVEL_WILLINGNESS,
      viewCount: t.VIEW_COUNT, bubbleCount: t.BUBBLE_COUNT,
      roles: roles.map(function(r) { return { name: r.ROLE_NAME, isPrimary: r.IS_PRIMARY }; }),
      socials: presence.map(function(p) { return { platform: p.PLATFORM, handle: p.HANDLE, url: p.URL }; }),
    };
  });
}

function getTalent_(id, user) {
  var talents = sheetToObjects_('Talents', COL.TALENTS);
  var t = talents.filter(function(x) { return x.ID === id; })[0];
  if (!t) return null;
  var roles = sheetToObjects_('TalentRoles', COL.TALENT_ROLES).filter(function(r) { return r.TALENT_ID === id; });
  var skills = sheetToObjects_('TalentSkills', COL.TALENT_SKILLS).filter(function(s) { return s.TALENT_ID === id; });
  var media = sheetToObjects_('TalentMedia', COL.TALENT_MEDIA).filter(function(m) { return m.TALENT_ID === id; });
  var presence = sheetToObjects_('TalentPresence', COL.TALENT_PRESENCE).filter(function(p) { return p.TALENT_ID === id; });
  return {
    id: t.ID, userId: t.USER_ID, name: t.DISPLAY_NAME, legalName: t.LEGAL_NAME,
    email: t.EMAIL, phone: t.PHONE, bio: t.BIO, location: t.LOCATION_LABEL,
    languages: t.LANGUAGES, travel: t.TRAVEL_WILLINGNESS,
    tier: t.VERIFICATION_TIER, availability: t.AVAILABILITY_STATUS,
    availabilityNotes: t.AVAILABILITY_NOTES, publicProfile: t.PUBLIC_PROFILE,
    viewCount: t.VIEW_COUNT, bubbleCount: t.BUBBLE_COUNT, lineupCount: t.LINEUP_COUNT,
    roles: roles, skills: skills.map(function(s) { return s.SKILL_TAG; }),
    media: media, socials: presence,
  };
}

function createTalent_(body, user) { return { success: true }; }
function updateTalent_(body, user) { return { success: true }; }
function deleteTalent_(body, user) { return { success: true }; }

function listProjects_(body, user) {
  var projects = sheetToObjects_('Projects', COL.PROJECTS);
  var slots = sheetToObjects_('RoleSlots', COL.ROLE_SLOTS);
  return projects.map(function(p) {
    var pSlots = slots.filter(function(s) { return s.PROJECT_ID === p.ID; });
    var totalSlots = pSlots.length;
    var filled = pSlots.filter(function(s) { return s.STATUS === 'filled'; }).length;
    return {
      id: p.ID, title: p.TITLE, type: p.PROJECT_TYPE, subtype: p.PROJECT_SUBTYPE,
      status: p.STATUS, budget: p.BUDGET, currency: p.CURRENCY,
      location: p.LOCATION_LABEL, updatedAt: p.UPDATED_AT,
      roles: totalSlots, filled: filled
    };
  });
}

function getProject_(id, user) { return null; }
function createProject_(body, user) { return { success: true }; }
function updateProject_(body, user) { return { success: true }; }

function listRoles_() { return sheetToObjects_('RolesDictionary', COL.ROLES_DICTIONARY); }

function getConfig_() {
  return {
    projectTypes: PROJECT_TYPES, projectSubtypes: PROJECT_SUBTYPES,
    currencies: CURRENCIES, rateTypes: RATE_TYPES,
    socialPlatforms: SOCIAL_PLATFORMS, roleCategories: ROLE_CATEGORIES
  };
}

function getAnalytics_(body, user) {
  var events = readAllShards_('Analytics', COL.ANALYTICS);
  return { total: events.length, events: events.slice(-100) };
}

function listNotifications_(user) {
  var all = readAllShards_('Notifications', COL.NOTIFICATIONS);
  return all.filter(function(n) { return n.USER_ID === user.id; });
}

function markNotificationRead_(id, user) { return { success: true }; }
function getUserProfile_(user) { return user; }
function updateUserProfile_(body, user) { return { success: true }; }
function handlePublicResponse_(body) { return { success: true }; }

function listRequests_(body, user) {
  return readAllShards_('Requests', COL.REQUESTS);
}

function getRequest_(id, user) {
  var reqs = readAllShards_('Requests', COL.REQUESTS);
  var req = reqs.filter(function(r) { return r.ID === id; })[0];
  if (!req) return null;
  var items = readAllShards_('RequestItems', COL.REQUEST_ITEMS).filter(function(i) { return i.REQUEST_ID === id; });
  return { request: req, items: items };
}

function createRequest_(body, user) { return { success: true }; }
function sendRequest_(body, user) { return { success: true }; }

/**
 * =====================================================
 * ICUNI CONNECT — Multi-Spreadsheet Configuration
 * =====================================================
 * 4-spreadsheet tenant architecture:
 * 
 *  ┌─────────────────┐  ┌─────────────────┐
 *  │    CORE          │  │   TALENTS        │
 *  │ SystemConfig     │  │ Talents          │
 *  │ Users            │  │ TalentRoles      │
 *  │ RolesDictionary  │  │ TalentSkills     │
 *  │ RoleAliases      │  │ TalentMedia      │
 *  │ DeletionQueue    │  │ TalentSocials    │
 *  └─────────────────┘  │ TalentPresence   │
 *                        └─────────────────┘
 *  ┌─────────────────┐  ┌─────────────────┐
 *  │   PROJECTS       │  │   ACTIVITY       │
 *  │ Projects         │  │ Sessions         │
 *  │ ProjectPhases    │  │ Notifications    │
 *  │ RoleSlots        │  │ Analytics        │
 *  │ Assignments      │  │ Requests         │
 *  └─────────────────┘  │ RequestItems     │
 *                        │ Responses        │
 *                        │ SystemLog        │
 *                        └─────────────────┘
 *
 *  Auto-sharding: When any tab exceeds MAX_ROWS_PER_SHEET,
 *  a new numbered tab is created (e.g. Analytics_2).
 */

// ─── INFRASTRUCTURE DEFAULTS ────────────────────────────
var DEFAULTS = {
  CORE_SHEET_ID:     '1t71ceYtObvs8QHtKmdKAZpbYs1POyQr3k6oyJDwhTSg',
  DRIVE_FOLDER_ID:   '1hvKX-VlJnIrgWCouHt6aklLCEjf-HOz3',
  ADMIN_EMAIL:       'menelek@icuni.org',
  DOMAIN:            'icuni.org'
};

// Sheet IDs stored in SystemConfig of Core spreadsheet.
// After first init, these are read from there.
var SS_KEYS = {
  CORE:     'core_sheet_id',
  TALENTS:  'talents_sheet_id',
  PROJECTS: 'projects_sheet_id',
  ACTIVITY: 'activity_sheet_id'
};

// ─── MAX ROWS BEFORE SHARDING ───────────────────────────
var MAX_ROWS_PER_SHEET = 5000;

// Tabs that are high-volume and eligible for auto-sharding
var SHARDABLE_TABS = [
  'Analytics', 'SystemLog', 'Notifications',
  'Requests', 'RequestItems', 'Responses', 'Sessions'
];

// ─── SPREADSHEET → TABS MAPPING ─────────────────────────
var SPREADSHEET_MAP = {
  CORE: {
    displayName: 'ICUNI Connect — Core',
    tabs: ['SystemConfig', 'Users', 'RolesDictionary', 'RoleAliases', 'DeletionQueue']
  },
  TALENTS: {
    displayName: 'ICUNI Connect — Talents',
    tabs: ['Talents', 'TalentRoles', 'TalentSkills', 'TalentMedia', 'TalentSocials', 'TalentPresence']
  },
  PROJECTS: {
    displayName: 'ICUNI Connect — Projects',
    tabs: ['Projects', 'ProjectPhases', 'RoleSlots', 'Assignments']
  },
  ACTIVITY: {
    displayName: 'ICUNI Connect — Activity',
    tabs: ['Sessions', 'Notifications', 'Analytics', 'Requests', 'RequestItems', 'Responses', 'SystemLog']
  }
};

// ─── TAB → SPREADSHEET REVERSE MAP ─────────────────────
var TAB_TO_SS = {};
(function buildReverseMap() {
  for (var ssKey in SPREADSHEET_MAP) {
    var tabs = SPREADSHEET_MAP[ssKey].tabs;
    for (var i = 0; i < tabs.length; i++) {
      TAB_TO_SS[tabs[i]] = ssKey;
    }
  }
})();

// ─── COLUMN MAPS (0-indexed) ────────────────────────────
var COL = {
  SYSTEM_CONFIG: { KEY: 0, VALUE: 1, UPDATED_AT: 2, UPDATED_BY: 3 },

  USERS: {
    ID: 0, NAME: 1, EMAIL: 2, ROLE: 3, AVATAR_URL: 4,
    GOOGLE_ID: 5, DEFAULT_CURRENCY: 6, MARKETING_OPT_IN: 7,
    CREATED_AT: 8, LAST_LOGIN: 9, STATUS: 10, PHONE: 11, PIN_HASH: 12
  },

  TALENTS: {
    ID: 0, USER_ID: 1, DISPLAY_NAME: 2, LEGAL_NAME: 3, EMAIL: 4,
    PHONE: 5, BIO: 6, LOCATION_LABEL: 7, PLACE_ID: 8, MAPS_LINK: 9,
    LANGUAGES: 10, TRAVEL_WILLINGNESS: 11, VERIFICATION_TIER: 12,
    AVAILABILITY_STATUS: 13, AVAILABILITY_NOTES: 14, PUBLIC_PROFILE: 15,
    PROFILE_IMAGE_FILE_ID: 16, TALENT_FOLDER_ID: 17,
    VIEW_COUNT: 18, BUBBLE_COUNT: 19, LINEUP_COUNT: 20,
    CREATED_AT: 21, UPDATED_AT: 22, STATUS: 23
  },

  TALENT_ROLES: {
    TALENT_ID: 0, ROLE_ID: 1, ROLE_NAME: 2, IS_PRIMARY: 3,
    EXPERIENCE_YEARS: 4, EXPERIENCE_FROZEN: 5, EXPERIENCE_BASE_YEAR: 6,
    RATE_VISIBILITY: 7, RATE_TYPE: 8, RATE_MIN: 9, RATE_MAX: 10,
    RATE_CURRENCY: 11, RATE_NOTES: 12
  },

  TALENT_SKILLS: {
    TALENT_ID: 0, SKILL_TAG: 1
  },

  TALENT_MEDIA: {
    TALENT_ID: 0, MEDIA_ID: 1, MEDIA_TYPE: 2, FILE_ID: 3,
    THUMB_URL: 4, URL: 5, CAPTION: 6, SORT_ORDER: 7, CREATED_AT: 8
  },

  TALENT_SOCIALS: {
    TALENT_ID: 0, PLATFORM: 1, HANDLE: 2, URL: 3
  },

  TALENT_PRESENCE: {
    TALENT_ID: 0, PLATFORM: 1, HANDLE: 2, URL: 3
  },

  PROJECTS: {
    ID: 0, OWNER_USER_ID: 1, TITLE: 2, VISIBILITY: 3, STATUS: 4,
    PROJECT_TYPE: 5, PROJECT_SUBTYPE: 6, GENRES: 7, BRIEF: 8,
    CURRENCY: 9, BUDGET: 10, LOCATION_LABEL: 11, PLACE_ID: 12,
    START_DATE: 13, END_DATE: 14, TIMELINE_MODE: 15,
    TOTAL_DURATION_DAYS: 16, TOTAL_DURATION_WEEKS: 17,
    PROJECT_FOLDER_ID: 18, CREATED_AT: 19, UPDATED_AT: 20
  },

  PROJECT_PHASES: {
    PROJECT_ID: 0, PHASE_ID: 1, ENABLED: 2,
    START_OFFSET_UNITS: 3, DURATION_UNITS: 4, COLOR_KEY: 5
  },

  ROLE_SLOTS: {
    ID: 0, PROJECT_ID: 1, ROLE_ID: 2, ROLE_NAME: 3,
    QUANTITY: 4, FILLED: 5, REQUIREMENTS: 6,
    OFFER_FEE: 7, FEE_CURRENCY: 8, FEE_UNIT: 9,
    STATUS: 10, SORT_ORDER: 11
  },

  ASSIGNMENTS: {
    ID: 0, SLOT_ID: 1, PROJECT_ID: 2, TALENT_ID: 3,
    TALENT_NAME: 4, STATUS: 5, ASSIGNED_AT: 6
  },

  SESSIONS: {
    SESSION_ID: 0, USER_ID: 1, CREATED_AT: 2, EXPIRES_AT: 3,
    IP_HASH: 4, USER_AGENT_HASH: 5, REVOKED_AT: 6
  },

  NOTIFICATIONS: {
    ID: 0, USER_ID: 1, TITLE: 2, MESSAGE: 3,
    TYPE: 4, READ: 5, CTA_URL: 6, TIMESTAMP: 7
  },

  ANALYTICS: {
    ID: 0, EVENT: 1, ENTITY_TYPE: 2, ENTITY_ID: 3,
    USER_ID: 4, METADATA: 5, TIMESTAMP: 6
  },

  REQUESTS: {
    ID: 0, PROJECT_ID: 1, SENDER_ID: 2, SUBJECT: 3,
    MESSAGE: 4, STATUS: 5, SENT_AT: 6,
    TOTAL_RECIPIENTS: 7, VIEWED: 8, ACCEPTED: 9,
    DECLINED: 10, QUESTIONS: 11, COUNTERS: 12, CREATED_AT: 13
  },

  REQUEST_ITEMS: {
    ID: 0, REQUEST_ID: 1, TALENT_ID: 2, TALENT_NAME: 3,
    SLOT_ID: 4, ROLE_NAME: 5, OFFER_FEE: 6, FEE_CURRENCY: 7,
    TOKEN: 8, STATUS: 9, SENT_AT: 10, RESPONDED_AT: 11
  },

  RESPONSES: {
    ID: 0, REQUEST_ITEM_ID: 1, TOKEN: 2, ACTION: 3,
    MESSAGE: 4, COUNTER_FEE: 5, RESPONDED_AT: 6
  },

  ROLES_DICTIONARY: {
    ID: 0, NAME: 1, CATEGORY: 2, DESCRIPTION: 3, SORT_ORDER: 4
  },

  ROLE_ALIASES: {
    ID: 0, ROLE_ID: 1, ALIAS: 2
  },

  SYSTEM_LOG: {
    TIMESTAMP: 0, LEVEL: 1, ACTION: 2, USER: 3, DETAILS: 4
  },

  DELETION_QUEUE: {
    ID: 0, ENTITY_TYPE: 1, ENTITY_ID: 2,
    REQUESTED_BY: 3, REQUESTED_AT: 4, DELETE_AFTER: 5, STATUS: 6
  }
};

// ─── CONSTANTS ──────────────────────────────────────────
var USER_ROLES = { ADMIN: 'Admin', PM: 'PM', TALENT: 'Talent' };

var VERIFICATION_TIERS = {
  UNVERIFIED: 'unverified', PROFILE: 'profile_verified',
  WORK: 'work_verified', PRO: 'pro_verified'
};

var AVAILABILITY = { AVAILABLE: 'available', LIMITED: 'limited', UNAVAILABLE: 'unavailable' };

var TRAVEL = { LOCAL: 'local_only', NATIONAL: 'national', INTERNATIONAL: 'international' };

var PROJECT_TYPES = [
  'Film', 'TV Series', 'Documentary', 'Music Video',
  'Commercial', 'Photo Shoot', 'Event', 'Other'
];

var PROJECT_SUBTYPES = {
  'Film': ['Feature Film','Short Film','Pilot','Web Series Episode'],
  'TV Series': ['Series Pilot','Season','Episode'],
  'Documentary': ['Feature Documentary','Short Documentary','Docuseries'],
  'Music Video': ['Performance','Narrative','Concept','Lyric Video'],
  'Commercial': ['TV Commercial','Digital Ad','Brand Film','Social Content'],
  'Photo Shoot': ['Editorial','Campaign','Portrait','Product'],
  'Event': ['Live Event','Conference','Workshop','Exhibition'],
  'Other': ['Other']
};

var PROJECT_STATUSES = {
  DRAFT: 'draft', ACTIVE: 'active', LOCKED: 'locked',
  COMPLETED: 'completed', ARCHIVED: 'archived'
};

var REQUEST_STATUSES = { DRAFT: 'draft', SENT: 'sent', CLOSED: 'closed' };

var RESPONSE_ACTIONS = {
  ACCEPTED: 'accepted', DECLINED: 'declined',
  QUESTION: 'question', COUNTER: 'counter'
};

var RATE_VISIBILITY = {
  HIDDEN: 'hidden', RANGE_PUBLIC: 'range_public',
  EXACT_PUBLIC: 'exact_public', EXACT_PRIVATE: 'exact_private'
};

var RATE_TYPES = ['open','hourly','half_day','day','weekly','per_project','package'];

var CURRENCIES = ['GHS','USD','GBP','EUR','NGN'];


var SOCIAL_PLATFORMS = [
  'instagram','tiktok','youtube','imdb','spotlight',
  'mandy','linkedin','behance','website','maps_business','other'
];

var ROLE_CATEGORIES = [
  'Directing','Camera','Sound','Lighting','Art & Design',
  'Makeup & Wardrobe','Editing & Post','Production','Acting',
  'Music','Writing','Other'
];

// ═══════════════════════════════════════════════════════
// MULTI-SPREADSHEET HELPERS
// ═══════════════════════════════════════════════════════

/**
 * In-memory spreadsheet cache (per execution).
 * Avoids repeated openById calls within a single request.
 */
var _ssCache = {};

function getCoreSpreadsheet_() {
  if (!_ssCache.CORE) _ssCache.CORE = SpreadsheetApp.openById(DEFAULTS.CORE_SHEET_ID);
  return _ssCache.CORE;
}

/**
 * Get spreadsheet ID for a given key (TALENTS, PROJECTS, ACTIVITY).
 * Reads from SystemConfig in Core spreadsheet.
 */
function getSpreadsheetId_(ssKey) {
  if (ssKey === 'CORE') return DEFAULTS.CORE_SHEET_ID;
  var configSheet = getCoreSpreadsheet_().getSheetByName('SystemConfig');
  if (!configSheet) return null;
  var data = configSheet.getDataRange().getValues();
  var configKey = SS_KEYS[ssKey];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === configKey) return data[i][1] || null;
  }
  return null;
}

/**
 * Open a spreadsheet by its tenant key.
 */
function getSpreadsheet_(ssKey) {
  if (_ssCache[ssKey]) return _ssCache[ssKey];
  if (ssKey === 'CORE') { return getCoreSpreadsheet_(); }
  var id = getSpreadsheetId_(ssKey);
  if (!id) throw new Error('Spreadsheet not initialized for: ' + ssKey + '. Run adminInit first.');
  _ssCache[ssKey] = SpreadsheetApp.openById(id);
  return _ssCache[ssKey];
}

/**
 * Get a sheet by tab name. Automatically resolves which spreadsheet it belongs to.
 */
function getSheet_(tabName) {
  var ssKey = TAB_TO_SS[tabName];
  if (!ssKey) throw new Error('Unknown tab: ' + tabName);
  var ss = getSpreadsheet_(ssKey);
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) sheet = ss.insertSheet(tabName);
  return sheet;
}

/**
 * Get the active shard for a shardable tab.
 * If the current shard exceeds MAX_ROWS_PER_SHEET, creates a new one.
 * Returns the sheet to write to.
 */
function getActiveWriteShard_(tabName) {
  if (SHARDABLE_TABS.indexOf(tabName) === -1) return getSheet_(tabName);
  
  var ssKey = TAB_TO_SS[tabName];
  var ss = getSpreadsheet_(ssKey);
  
  // Find highest numbered shard
  var sheets = ss.getSheets();
  var shardNum = 1;
  var activeSheet = null;
  
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name === tabName) {
      if (shardNum === 1) activeSheet = sheets[i];
    } else if (name.indexOf(tabName + '_') === 0) {
      var num = parseInt(name.replace(tabName + '_', ''), 10);
      if (num > shardNum) {
        shardNum = num;
        activeSheet = sheets[i];
      }
    }
  }
  
  if (!activeSheet) {
    activeSheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    return activeSheet;
  }
  
  // Check if we need a new shard
  if (activeSheet.getLastRow() >= MAX_ROWS_PER_SHEET) {
    var newName = tabName + '_' + (shardNum + 1);
    var newSheet = ss.insertSheet(newName);
    // Copy header from original
    var originalHeaders = ss.getSheetByName(tabName).getRange(1, 1, 1, ss.getSheetByName(tabName).getLastColumn()).getValues()[0];
    newSheet.appendRow(originalHeaders);
    logSystem_('INFO', 'AUTO_SHARD', 'system', 'Created shard: ' + newName + ' (previous had ' + activeSheet.getLastRow() + ' rows)');
    return newSheet;
  }
  
  return activeSheet;
}

/**
 * Read all data across all shards of a tab. Returns combined array.
 */
function readAllShards_(tabName, colMap) {
  var ssKey = TAB_TO_SS[tabName];
  var ss = getSpreadsheet_(ssKey);
  var sheets = ss.getSheets();
  var results = [];
  
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name === tabName || name.indexOf(tabName + '_') === 0) {
      var data = sheets[i].getDataRange().getValues();
      if (data.length <= 1) continue;
      var headers = Object.keys(colMap);
      for (var r = 1; r < data.length; r++) {
        var obj = {};
        for (var h = 0; h < headers.length; h++) {
          var key = headers[h];
          var val = data[r][colMap[key]] !== undefined ? data[r][colMap[key]] : '';
          if (val instanceof Date) val = val.toISOString();
          obj[key] = val;
        }
        results.push(obj);
      }
    }
  }
  return results;
}

// ─── GENERIC HELPERS ────────────────────────────────────

function getNextId_(prefix) {
  return prefix + '-' + Utilities.getUuid().substring(0, 8);
}

function now_() {
  return new Date().toISOString();
}

function sheetToObjects_(tabName, colMap) {
  if (SHARDABLE_TABS.indexOf(tabName) !== -1) return readAllShards_(tabName, colMap);
  var sheet = getSheet_(tabName);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = Object.keys(colMap);
  var results = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var h = 0; h < headers.length; h++) {
      var key = headers[h];
      var val = data[i][colMap[key]] !== undefined ? data[i][colMap[key]] : '';
      if (val instanceof Date) val = val.toISOString();
      obj[key] = val;
    }
    results.push(obj);
  }
  return results;
}

function findRowIndex_(tabName, colIndex, value) {
  var sheet = getSheet_(tabName);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) return i + 1;
  }
  return -1;
}

function appendRow_(tabName, rowArray) {
  var sheet;
  if (SHARDABLE_TABS.indexOf(tabName) !== -1) {
    sheet = getActiveWriteShard_(tabName);
  } else {
    sheet = getSheet_(tabName);
  }
  sheet.appendRow(rowArray);
}

function updateCell_(tabName, row, col, value) {
  getSheet_(tabName).getRange(row, col + 1).setValue(value);
}

function logSystem_(level, action, user, details) {
  try {
    appendRow_('SystemLog', [now_(), level, action, user || '', details || '']);
  } catch (e) {}
}

function logError_(context, err) {
  logSystem_('ERROR', context, '', err.message + ' | ' + (err.stack || ''));
}

function getMainDriveFolder_() {
  return DriveApp.getFolderById(DEFAULTS.DRIVE_FOLDER_ID);
}

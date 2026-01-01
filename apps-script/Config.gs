// ============================================
// ICUNI Connect - Apps Script Configuration
// ============================================

// Your Google Sheets ID (replace this after creating the spreadsheet)
const SPREADSHEET_ID = '13mECA2h7pgWxuZQWLfQo2N5cDxAOY2srNw-PjzziUUE';

// Session management (simple token-based for MVP)
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// CORS headers for web app
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Table names (must match sheet names exactly)
const TABLES = {
  USERS: 'Users',
  ROLES: 'Roles',
  ROLE_ALIASES: 'RoleAliases',
  TALENTS: 'Talents',
  TALENT_LINKS: 'TalentLinks',
  TALENT_RATES: 'TalentRates',
  AVAILABILITY: 'AvailabilityCalendar',
  PROJECTS: 'Projects',
  ROLE_SLOTS: 'RoleSlots',
  LINEUP: 'Lineup',
  REQUESTS: 'Requests',
  THREADS: 'Threads',
  MESSAGES: 'Messages',
  VERIFICATION_LOG: 'VerificationLog',
  SHORTLISTS: 'Shortlists'
};

// Status enums for validation
const STATUS_ENUMS = {
  USER_STATUS: ['active', 'suspended', 'pending'],
  VERIFICATION_LEVEL: ['unverified', 'profile_verified', 'work_verified', 'pro_verified'],
  AVAILABILITY_STATUS: ['available', 'limited', 'unavailable'],
  PROJECT_STATUS: ['draft', 'staffing', 'requests_sent', 'locked', 'booked', 'completed', 'cancelled'],
  LINEUP_STATUS: ['shortlisted', 'invited', 'accepted', 'declined', 'negotiating', 'locked', 'removed'],
  REQUEST_STATUS: ['draft', 'sent', 'viewed', 'accepted', 'declined', 'question', 'countered', 'expired', 'cancelled']
};

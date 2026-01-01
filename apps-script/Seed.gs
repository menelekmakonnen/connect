// ============================================
// ICUNI Connect - Seed Data Generator
// ============================================

/**
 * MASTER SEED FUNCTION
 * Run this once to populate all tables with realistic test data
 */
function seedAllData() {
  Logger.log('🌱 Starting seed process...');
  
  // CRITICAL: Clear existing data first (optional - comment out if you want to keep existing data)
  // clearAllData();
  
  // Seed in dependency order
  seedRoles();
  seedRoleAliases();
  seedUsers();
  seedTalents();
  seedTalentLinks();
  seedTalentRates();
  seedProjects();
  seedRoleSlots();
  seedLineupEntries();
  seedRequests();
  
  Logger.log('✅ Seed complete! All tables populated.');
  Logger.log('🎬 Your ICUNI Connect platform is ready for testing!');
}

/**
 * Clear all data (use with caution!)
 */
function clearAllData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.values(TABLES).forEach(tableName => {
    const sheet = ss.getSheetByName(tableName);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
      Logger.log(`Cleared: ${tableName}`);
    }
  });
}

// ============================================
// SEED FUNCTIONS
// ============================================

function seedRoles() {
  const roles = [
    ['ROLE_001', 'Director', 'Production', 'director,filmmaker', true],
    ['ROLE_002', 'Director of Photography', 'Camera', 'dop,dp,cinematographer,cameraman', true],
    ['ROLE_003', 'Camera Operator', 'Camera', 'camera op,shooter', true],
    ['ROLE_004', 'Gaffer', 'Lighting/Grip', 'chief lighting,lighting head', true],
    ['ROLE_005', 'Sound Mixer', 'Sound', 'sound recordist,audio engineer', true],
    ['ROLE_006', 'Boom Operator', 'Sound', 'boom op,boom', true],
    ['ROLE_007', 'Makeup Artist', 'HairMakeup', 'mua,makeup,beauty', true],
    ['ROLE_008', 'Hair Stylist', 'HairMakeup', 'hairstylist,hair', true],
    ['ROLE_009', 'Art Director', 'Art/Wardrobe', 'production designer,art', true],
    ['ROLE_010', 'Stylist', 'Art/Wardrobe', 'wardrobe,costume designer', true],
    ['ROLE_011', 'Production Manager', 'Production', 'pm,line producer', true],
    ['ROLE_012', 'Producer', 'Production', 'exec producer,creative producer', true],
    ['ROLE_013', 'Model', 'Cast', 'talent,actor', true],
    ['ROLE_014', 'Editor', 'Post', 'video editor,post production', true],
    ['ROLE_015', 'Colorist', 'Post', 'color grading,colorist', true],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.ROLES);
  if (sheet.getLastRow() === 1) { // Only seed if empty
    sheet.getRange(2, 1, roles.length, roles[0].length).setValues(roles);
    Logger.log(`✓ Seeded ${roles.length} roles`);
  }
}

function seedRoleAliases() {
  const aliases = [
    ['ALIAS_001', 'DOP', 'ROLE_002', 10],
    ['ALIAS_002', 'DP', 'ROLE_002', 10],
    ['ALIAS_003', 'Cinematographer', 'ROLE_002', 8],
    ['ALIAS_004', 'MUA', 'ROLE_007', 10],
    ['ALIAS_005', 'Makeup', 'ROLE_007', 8],
    ['ALIAS_006', 'Boom Op', 'ROLE_006', 10],
    ['ALIAS_007', 'Line Producer', 'ROLE_011', 8],
    ['ALIAS_008', 'PM', 'ROLE_011', 10],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.ROLE_ALIASES);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, aliases.length, aliases[0].length).setValues(aliases);
    Logger.log(`✓ Seeded ${aliases.length} role aliases`);
  }
}

function seedUsers() {
  const users = [
    ['USR_001', 'kwame.mensah@icuni.com', 'Kwame Mensah', '+233244123456', 'talent', 'active', new Date(), new Date(), 'Africa/Accra', 'whatsapp'],
    ['USR_002', 'ama.darko@icuni.com', 'Ama Darko', '+233244234567', 'talent', 'active', new Date(), new Date(), 'Africa/Accra', 'whatsapp'],
    ['USR_003', 'kofi.antwi@icuni.com', 'Kofi Antwi', '+233244345678', 'talent', 'active', new Date(), new Date(), 'Africa/Accra', 'email'],
    ['USR_004', 'adwoa.smart@icuni.com', 'Adwoa Smart', '+233244456789', 'pm', 'active', new Date(), new Date(), 'Africa/Accra', 'email'],
    ['USR_005', 'yaw.rock@icuni.com', 'Yaw B. Rock', '+233244567890', 'talent', 'active', new Date(), new Date(), 'Africa/Accra', 'whatsapp'],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.USERS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, users.length, users[0].length).setValues(users);
    Logger.log(`✓ Seeded ${users.length} users`);
  }
}

function seedTalents() {
  const talents = [
    ['TLNT_001', 'USR_001', 'kwame-mensah', 'Kwame Mensah', 'Award-Winning Cinematographer', 'Experienced DP with 10+ years in music videos and commercials', 'Accra', 'Labone', 'English,Twi', 'ROLE_002', 'ROLE_003', 'pro_verified', 'available', '', '', '', true, 'Cinematic,Documentary,Commercial', new Date(), new Date()],
    ['TLNT_002', 'USR_002', 'ama-darko', 'Ama Darko', 'Professional MUA for Film & TV', 'Specializing in SFX and natural looks for screen', 'Accra', 'Osu', 'English,Ga', 'ROLE_007', 'ROLE_008', 'work_verified', 'limited', 'Booked Dec 25-31', '', '', false, 'SFX,Glam,Natural', new Date(), new Date()],
    ['TLNT_003', 'USR_003', 'kofi-antwi', 'Kofi Antwi', 'Gaffer / Lighting Best Boy', 'Expert in studio and location lighting', 'Kumasi', 'Adum', 'English,Twi,Fante', 'ROLE_004', '', 'profile_verified', 'available', '', '', '', false, 'Studio,Location,Night Shoots', new Date(), new Date()],
    ['TLNT_004', '', 'elorm-artistry', 'Elorm Artistry', 'Art Director', 'Creative set designer with prop mastery', 'Tema', 'Community 1', 'English,Ewe', 'ROLE_009', 'ROLE_010', 'profile_verified', 'available', '', '', '', false, 'Set Design,Prop Master', new Date(), new Date()],
    ['TLNT_005', 'USR_005', 'yaw-b', 'Yaw B. Rock', 'Sound Recordist & Mixer', 'Professional field recording and post mix', 'Accra', 'Madina', 'English,Twi', 'ROLE_005', 'ROLE_006', 'work_verified', 'available', '', '', '', true, 'Field Recording,Boom Op', new Date(), new Date()],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.TALENTS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, talents.length, talents[0].length).setValues(talents);
    Logger.log(`✓ Seeded ${talents.length} talents`);
  }
}

function seedTalentLinks() {
  const links = [
    ['LINK_001', 'TLNT_001', 'instagram', 'Instagram', 'https://instagram.com/kwamemensah_dp', true, new Date()],
    ['LINK_002', 'TLNT_001', 'vimeo', 'Portfolio', 'https://vimeo.com/kwamemensah', true, new Date()],
    ['LINK_003', 'TLNT_002', 'instagram', 'Instagram', 'https://instagram.com/amadarko_mua', true, new Date()],
    ['LINK_004', 'TLNT_002', 'tiktok', 'TikTok', 'https://tiktok.com/@amadarkomua', false, new Date()],
    ['LINK_005', 'TLNT_005', 'youtube', 'Sound Demos', 'https://youtube.com/@yawbrock', true, new Date()],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.TALENT_LINKS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, links.length, links[0].length).setValues(links);
    Logger.log(`✓ Seeded ${links.length} talent links`);
  }
}

function seedTalentRates() {
  const rates = [
    ['RATE_001', 'TLNT_001', 'range_public', 'day', 'GHS', 3000, 5000, '', 'Full shoot day (10-12 hours)', 'OT at 1.5x after 12hrs', 'Usage negotiable', 'Full refund if cancelled 7+ days prior', new Date()],
    ['RATE_002', 'TLNT_002', 'range_public', 'day', 'GHS', 1500, 2500, '', 'Includes basic kit', '', 'One use only', 'No refund within 48hrs', new Date()],
    ['RATE_003', 'TLNT_003', 'range_public', 'day', 'GHS', 1200, 2000, '', '8-hour day', 'OT at 1.5x', '', '50% refund if 3+ days notice', new Date()],
    ['RATE_004', 'TLNT_005', 'range_public', 'day', 'GHS', 2000, 3500, '', 'Includes boom and recorder', '', '', '', new Date()],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.TALENT_RATES);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, rates.length, rates[0].length).setValues(rates);
    Logger.log(`✓ Seeded ${rates.length} talent rates`);
  }
}

function seedProjects() {
  const projects = [
    ['PRJ_001', 'USR_004', 'Summer Vibes Commercial', 'brand_shoot', 'staffing', '2024-02-15', '2024-02-16', 'Accra', 'Labadi Beach', 'High-energy beverage ad targeting Gen Z', '', 'premium', 'Refresh Drinks Ltd', 'public', new Date(), new Date()],
    ['PRJ_002', 'USR_004', 'Indie Short Film "Echoes"', 'short_film', 'draft', '2024-03-01', '2024-03-05', 'Kumasi', 'Various locations', 'Drama about family reunion', '', 'low', '', 'private', new Date(), new Date()],
    ['PRJ_003', 'USR_004', 'Azonto Music Video', 'music_video', 'locked', '2024-01-20', '2024-01-20', 'Tema', 'Community 25', 'High-energy dance video', '', 'mid', '', 'public', new Date(), new Date()],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.PROJECTS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, projects.length, projects[0].length).setValues(projects);
    Logger.log(`✓ Seeded ${projects.length} projects`);
  }
}

function seedRoleSlots() {
  const slots = [
    ['SLOT_001', 'PRJ_001', 'ROLE_002', 1, 'Must have experience with RED cameras', 5000, 'GHS', 'must_have', 'open'],
    ['SLOT_002', 'PRJ_001', 'ROLE_007', 1, 'Natural beach looks', 2000, 'GHS', 'must_have', 'filled'],
    ['SLOT_003', 'PRJ_001', 'ROLE_013', 3, 'Ages 18-25, athletic build', 800, 'GHS', 'must_have', 'open'],
    ['SLOT_004', 'PRJ_002', 'ROLE_002', 1, '', 3000, 'GHS', 'must_have', 'open'],
    ['SLOT_005', 'PRJ_002', 'ROLE_005', 1, '', 2000, 'GHS', 'must_have', 'filled'],
    ['SLOT_006', 'PRJ_003', 'ROLE_002', 1, 'Fast-paced choreography', 4000, 'GHS', 'must_have', 'filled'],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.ROLE_SLOTS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, slots.length, slots[0].length).setValues(slots);
    Logger.log(`✓ Seeded ${slots.length} role slots`);
  }
}

function seedLineupEntries() {
  const entries = [
    ['LINE_001', 'PRJ_001', 'SLOT_002', 'TLNT_002', 'Lead MUA', 2000, 'GHS', 'Full cast + crew', 'Great attitude', 'accepted', new Date(), new Date()],
    ['LINE_002', 'PRJ_002', 'SLOT_005', 'TLNT_005', 'Sound Recordist', 2500, 'GHS', 'All location audio', '', 'shortlisted', new Date(), new Date()],
    ['LINE_003', 'PRJ_003', 'SLOT_006', 'TLNT_001', 'DP', 4000, 'GHS', 'Full day shoot', 'Confirmed via WhatsApp', 'locked', new Date(), new Date()],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.LINEUP);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, entries.length, entries[0].length).setValues(entries);
    Logger.log(`✓ Seeded ${entries.length} lineup entries`);
  } else {
    Logger.log(`⊘ Lineup already has data, skipping`);
  }
}

function seedRequests() {
  const requests = [
    ['REQ_001', 'PRJ_001', 'SLOT_002', 'TLNT_002', 'LINE_001', 'USR_004', 2000, 'GHS', 'Looking forward to working with you!', 'accepted', new Date(), new Date(), new Date(), 'accept', '', '', '', ''],
    ['REQ_002', 'PRJ_001', 'SLOT_001', 'TLNT_001', 'LINE_999', 'USR_004', 5000, 'GHS', 'Premium commercial shoot. Are you available?', 'sent', new Date(), '', '', '', '', '', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), ''],
    ['REQ_003', 'PRJ_002', 'SLOT_005', 'TLNT_005', 'LINE_002', 'USR_004', 2500, 'GHS', 'Indie film - tight budget but great creative opportunity', 'viewed', new Date(), new Date(), '', '', '', '', new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), ''],
  ];
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABLES.REQUESTS);
  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, requests.length, requests[0].length).setValues(requests);
    Logger.log(`✓ Seeded ${requests.length} requests`);
  }
}

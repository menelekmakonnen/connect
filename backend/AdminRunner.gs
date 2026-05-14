/**
 * ICUNI CONNECT — Admin Runner
 * Public entry-point functions visible in the Apps Script dropdown.
 * (Functions ending with _ are private in Apps Script)
 */

/**
 * STEP 1: Run this first.
 * Creates the 3 satellite spreadsheets (Talents, Projects, Activity)
 * in your Drive folder and initializes all tabs with headers.
 */
function ADMIN_InitializeAll() {
  var result = initializeAll_();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * STEP 2: Run this second.
 * Seeds the RolesDictionary and RoleAliases tabs with 65 canonical
 * film industry roles and 200+ aliases.
 */
function ADMIN_SeedRoles() {
  var result = seedRolesDictionary_();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * STEP 3: Run this third.
 * Seeds all spreadsheets with realistic demo data:
 * 12 users, 10 talents, 5 projects, requests, analytics.
 */
function ADMIN_SeedAllData() {
  var result = seedAllData_();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * STEP 4 (optional): Run to set up Drive folder hierarchy.
 */
function ADMIN_InitDriveFolders() {
  var result = initDriveFolders_();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Health check — returns system status.
 */
function ADMIN_HealthCheck() {
  var status = {
    core: DEFAULTS.CORE_SHEET_ID,
    talents: getSpreadsheetId_('TALENTS'),
    projects: getSpreadsheetId_('PROJECTS'),
    activity: getSpreadsheetId_('ACTIVITY'),
    drive: DEFAULTS.DRIVE_FOLDER_ID,
    timestamp: new Date().toISOString()
  };
  Logger.log(JSON.stringify(status, null, 2));
  return status;
}

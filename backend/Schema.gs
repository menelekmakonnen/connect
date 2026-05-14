/**
 * ICUNI CONNECT — Schema Initialization (Multi-Spreadsheet)
 * Creates all 4 spreadsheets, initializes tabs with headers,
 * stores cross-references in SystemConfig.
 */

function initializeAll_() {
  var results = [];
  var core = getCoreSpreadsheet_();

  // ── 1. Ensure SystemConfig tab exists in Core ─────────
  var configSheet = core.getSheetByName('SystemConfig');
  if (!configSheet) {
    configSheet = core.insertSheet('SystemConfig');
    configSheet.appendRow(['key', 'value', 'updated_at', 'updated_by']);
    results.push('Created SystemConfig in Core');
  }

  // ── 2. Create satellite spreadsheets if not yet ───────
  var folder = getMainDriveFolder_();

  var satelliteKeys = ['TALENTS', 'PROJECTS', 'ACTIVITY'];
  for (var s = 0; s < satelliteKeys.length; s++) {
    var ssKey = satelliteKeys[s];
    var existingId = getSpreadsheetId_(ssKey);

    if (!existingId) {
      var newSS = SpreadsheetApp.create(SPREADSHEET_MAP[ssKey].displayName);
      var newFile = DriveApp.getFileById(newSS.getId());
      newFile.moveTo(folder);
      existingId = newSS.getId();

      // Store reference in SystemConfig
      setConfigValue_(configSheet, SS_KEYS[ssKey], existingId, 'system');
      results.push('Created spreadsheet: ' + SPREADSHEET_MAP[ssKey].displayName + ' → ' + existingId);

      // Clear _ssCache so next call picks it up
      _ssCache[ssKey] = newSS;
    } else {
      results.push('OK: ' + ssKey + ' = ' + existingId);
    }
  }

  // ── 3. Create all tabs with headers ───────────────────
  var schemas = buildSchemas_();

  for (var tabName in schemas) {
    try {
      var ssKey2 = TAB_TO_SS[tabName];
      var ss = getSpreadsheet_(ssKey2);
      var sheet = ss.getSheetByName(tabName);
      var expectedHeaders = schemas[tabName];

      if (!sheet) {
        sheet = ss.insertSheet(tabName);
        sheet.appendRow(expectedHeaders);
        results.push('Created: ' + tabName + ' in ' + ssKey2);
      } else {
        // Auto-migrate: add missing columns
        var lastCol = sheet.getLastColumn() || 0;
        var currentHeaders = lastCol > 0
          ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).toLowerCase(); })
          : [];

        var missing = expectedHeaders.filter(function(h) { return currentHeaders.indexOf(h) === -1; });
        if (missing.length > 0) {
          for (var m = 0; m < missing.length; m++) {
            sheet.getRange(1, lastCol + 1 + m).setValue(missing[m]);
          }
          results.push('Migrated ' + tabName + ': +' + missing.join(', '));
        } else {
          results.push('OK: ' + tabName);
        }
      }
    } catch (e) {
      results.push('ERROR: ' + tabName + ' — ' + e.message);
    }
  }

  // ── 4. Seed system config ─────────────────────────────
  seedSystemConfig_(configSheet);
  results.push('SystemConfig seeded');

  // ── 5. Clean up default "Sheet1" from satellite spreadsheets ──
  for (var sk = 0; sk < satelliteKeys.length; sk++) {
    try {
      var sat = getSpreadsheet_(satelliteKeys[sk]);
      var sheet1 = sat.getSheetByName('Sheet1');
      if (sheet1 && sat.getSheets().length > 1) {
        sat.deleteSheet(sheet1);
      }
    } catch (e) {}
  }

  // ── 6. Initialize Drive folders ───────────────────────
  try {
    var driveResult = initDriveFolders_();
    results.push('Drive folders: ' + driveResult.folders.join(', '));
  } catch (e) {
    results.push('Drive folders ERROR: ' + e.message);
  }

  return { success: true, results: results };
}

// ─── Schema definitions ─────────────────────────────────
function buildSchemas_() {
  var s = {};
  // Core
  s['SystemConfig']    = ['key','value','updated_at','updated_by'];
  s['Users']           = ['user_id','email','display_name','photo_url','role','google_id','default_currency','marketing_opt_in','created_at','last_login','status','phone','pin_hash'];
  s['RolesDictionary'] = ['role_id','name','category','description','sort_order'];
  s['RoleAliases']     = ['alias_id','role_id','alias'];
  s['DeletionQueue']   = ['id','entity_type','entity_id','requested_by','requested_at','delete_after','status'];

  // Talents
  s['Talents']         = ['talent_id','owner_user_id','display_name','legal_name','email','phone','bio','location_label','place_id','maps_link','languages','travel_willingness','verification_tier','availability_status','availability_notes','public_profile','profile_image_file_id','talent_folder_id','view_count','bubble_count','lineup_count','created_at','updated_at','status'];
  s['TalentRoles']     = ['talent_id','role_id','role_name','is_primary','experience_years','experience_frozen','experience_base_year','rate_visibility','rate_type','rate_min','rate_max','rate_currency','rate_notes'];
  s['TalentSkills']    = ['talent_id','skill_tag'];
  s['TalentMedia']     = ['talent_id','media_id','media_type','file_id','thumb_url','url','caption','sort_order','created_at'];
  s['TalentSocials']   = ['talent_id','platform','handle','url'];
  s['TalentPresence']  = ['talent_id','platform','handle','url'];

  // Projects
  s['Projects']        = ['project_id','owner_user_id','title','visibility','status','project_type','project_subtype','genres','brief','currency','budget','location_label','place_id','start_date','end_date','timeline_mode','total_duration_days','total_duration_weeks','project_folder_id','created_at','updated_at'];
  s['ProjectPhases']   = ['project_id','phase_id','enabled','start_offset_units','duration_units','color_key'];
  s['RoleSlots']       = ['slot_id','project_id','role_id','role_name','quantity','filled','requirements','offer_fee','fee_currency','fee_unit','status','sort_order'];
  s['Assignments']     = ['assignment_id','slot_id','project_id','talent_id','talent_name','status','assigned_at'];

  // Activity
  s['Sessions']        = ['session_id','user_id','created_at','expires_at','ip_hash','user_agent_hash','revoked_at'];
  s['Notifications']   = ['notif_id','user_id','title','message','type','read','cta_url','timestamp'];
  s['Analytics']       = ['event_id','event','entity_type','entity_id','user_id','metadata','timestamp'];
  s['Requests']        = ['request_id','project_id','sender_id','subject','message','status','sent_at','total_recipients','viewed','accepted','declined','questions','counters','created_at'];
  s['RequestItems']    = ['item_id','request_id','talent_id','talent_name','slot_id','role_name','offer_fee','fee_currency','token','status','sent_at','responded_at'];
  s['Responses']       = ['response_id','request_item_id','token','action','message','counter_fee','responded_at'];
  s['SystemLog']       = ['timestamp','level','action','user','details'];

  return s;
}

// ─── Config helpers ─────────────────────────────────────
function setConfigValue_(configSheet, key, value, user) {
  var data = configSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      configSheet.getRange(i + 1, 2).setValue(value);
      configSheet.getRange(i + 1, 3).setValue(now_());
      configSheet.getRange(i + 1, 4).setValue(user);
      return;
    }
  }
  configSheet.appendRow([key, value, now_(), user]);
}

function seedSystemConfig_(configSheet) {
  var seeds = [
    ['app_name', 'ICUNI Connect'],
    ['app_version', '2.0.0'],
    ['base_url', ''],
    ['default_currency', 'GHS'],
    ['max_talent_images', '5'],
    ['max_budget', '1000000'],
    ['roles_version', '1'],
    ['analytics_public_enabled', 'true'],
    ['maintenance_mode', 'false']
  ];

  var data = configSheet.getDataRange().getValues();
  var existingKeys = data.map(function(r) { return r[0]; });

  for (var i = 0; i < seeds.length; i++) {
    if (existingKeys.indexOf(seeds[i][0]) === -1) {
      configSheet.appendRow([seeds[i][0], seeds[i][1], now_(), 'system']);
    }
  }
}

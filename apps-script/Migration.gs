/**
 * MIGRATION SCRIPT
 * Run this function from the Apps Script editor to ensure all required columns exist
 */
function migrateDatabaseStructure() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  var migrations = [
    {
      table: TABLES.TALENTS,
      columns: ['visibility']
    },
    {
      table: TABLES.PROJECTS,
      columns: ['visibility']
    }
  ];
  
  migrations.forEach(function(m) {
    var sheet = ss.getSheetByName(m.table);
    if (!sheet) {
      Logger.log('Warning: Sheet ' + m.table + ' not found.');
      return;
    }
    
    var rawHeaders = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
    var headers = rawHeaders.map(function(h) { return h.toString().trim().toLowerCase(); });
    
    m.columns.forEach(function(col) {
      if (headers.indexOf(col.toLowerCase()) === -1) {
        // Add missing column
        var newColNum = sheet.getLastColumn() + 1;
        sheet.getRange(1, newColNum).setValue(col);
        Logger.log('Success: Added column "' + col + '" to ' + m.table);
      } else {
        Logger.log('Info: Column "' + col + '" already exists in ' + m.table);
      }
    });
  });
  
  Logger.log('Migration complete!');
}

/**
 * Diagnostic function to see what's actually in the database
 */
function debugCheckColumns() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var keys = Object.keys(TABLES);
  keys.forEach(function(key) {
    var tableName = TABLES[key];
    var sheet = ss.getSheetByName(tableName);
    if (sheet) {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      Logger.log(tableName + ' headers: ' + headers.join(', '));
    } else {
      Logger.log(tableName + ' NOT FOUND');
    }
  });
}

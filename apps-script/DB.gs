// ============================================
// ICUNI Connect - Database Operations
// ============================================

/**
 * Get the spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Get a specific sheet by name
 */
function getSheet(tableName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(tableName);
  if (!sheet) {
    throw new Error(`Sheet "${tableName}" not found`);
  }
  return sheet;
}

/**
 * Get all rows from a sheet as objects
 */
function dbSelectAll(tableName) {
  const sheet = getSheet(tableName);
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return [];
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Select rows with filtering
 */
function dbSelect(tableName, filter) {
  const allRows = dbSelectAll(tableName);
  
  if (!filter) {
    return allRows;
  }
  
  return allRows.filter(row => {
    for (const key in filter) {
      if (row[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Find a single row by filter
 */
function dbFindOne(tableName, filter) {
  const results = dbSelect(tableName, filter);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert a new row
 */
function dbInsert(tableName, data) {
  const sheet = getSheet(tableName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Build row from data matching headers
  const row = headers.map(header => {
    return data[header] !== undefined ? data[header] : '';
  });
  
  sheet.appendRow(row);
  
  return data;
}

/**
 * Update row(s) matching a filter
 */
function dbUpdate(tableName, filter, updates) {
  const sheet = getSheet(tableName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let updatedCount = 0;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = row[index];
    });
    
    // Check if row matches filter
    let matches = true;
    for (const key in filter) {
      if (rowObj[key] !== filter[key]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      // Apply updates
      for (const key in updates) {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(updates[key]);
        }
      }
      updatedCount++;
    }
  }
  
  return { ok: true, updated: updatedCount };
}

/**
 * Delete row(s) matching a filter (actually marks as deleted)
 */
function dbDelete(tableName, filter) {
  // For now, we'll use soft delete by setting a 'deleted' field
  return dbUpdate(tableName, filter, { deleted: true });
}

/**
 * Get the next row number for a sheet (for manual ID assignment if needed)
 */
function getNextRowNumber(tableName) {
  const sheet = getSheet(tableName);
  return sheet.getLastRow();
}

/**
 * Search function with case-insensitive text matching
 */
function dbSearch(tableName, searchFields, query) {
  const allRows = dbSelectAll(tableName);
  const lowerQuery = query.toLowerCase();
  
  return allRows.filter(row => {
    for (const field of searchFields) {
      const value = row[field];
      if (value && value.toString().toLowerCase().includes(lowerQuery)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Batch insert multiple rows
 */
function dbBatchInsert(tableName, dataArray) {
  const sheet = getSheet(tableName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rows = dataArray.map(data => {
    return headers.map(header => {
      return data[header] !== undefined ? data[header] : '';
    });
  });
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  }
  
  return { ok: true, inserted: rows.length };
}

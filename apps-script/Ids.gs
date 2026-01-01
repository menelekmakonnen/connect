// ============================================
// ICUNI Connect - ID Generation
// ============================================

/**
 * Generate a unique ID with a prefix
 * Format: PREFIX_000001
 */
function generateId(prefix, tableName, idField) {
  const allRows = dbSelectAll(tableName);
  
  // Extract existing IDs
  const existingIds = allRows
    .map(row => row[idField])
    .filter(id => id && id.startsWith(prefix));
  
  if (existingIds.length === 0) {
    return `${prefix}_000001`;
  }
  
  // Find the highest number
  const numbers = existingIds.map(id => {
    const parts = id.split('_');
    return parseInt(parts[parts.length - 1], 10);
  });
  
  const maxNumber = Math.max(...numbers);
  const nextNumber = maxNumber + 1;
  
  // Pad with zeros (6 digits)
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  
  return `${prefix}_${paddedNumber}`;
}

/**
 * Generate User ID
 */
function generateUserId() {
  return generateId('USR', TABLES.USERS, 'user_id');
}

/**
 * Generate Talent ID
 */
function generateTalentId() {
  return generateId('TLNT', TABLES.TALENTS, 'talent_id');
}

/**
 * Generate Project ID
 */
function generateProjectId() {
  return generateId('PRJ', TABLES.PROJECTS, 'project_id');
}

/**
 * Generate Role Slot ID
 */
function generateSlotId() {
  return generateId('SLOT', TABLES.ROLE_SLOTS, 'slot_id');
}

/**
 * Generate Lineup ID
 */
function generateLineupId() {
  return generateId('LUP', TABLES.LINEUP, 'lineup_id');
}

/**
 * Generate Request ID
 */
function generateRequestId() {
  return generateId('REQ', TABLES.REQUESTS, 'request_id');
}

/**
 * Generate Link ID
 */
function generateLinkId() {
  return generateId('LNK', TABLES.TALENT_LINKS, 'link_id');
}

/**
 * Generate Rate ID
 */
function generateRateId() {
  return generateId('RATE', TABLES.TALENT_RATES, 'rate_id');
}

/**
 * Generate public slug from name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug with collision handling
 */
function generateUniqueSlug(name, tableName) {
  const baseSlug = generateSlug(name);
  const existingSlugs = dbSelectAll(tableName).map(row => row.public_slug);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Add number suffix if collision
  let counter = 1;
  let slug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  
  return slug;
}

/**
 * Get current timestamp in ISO format
 */
function getTimestamp() {
  return new Date().toISOString();
}

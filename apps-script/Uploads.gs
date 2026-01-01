/**
 * ICUNI Connect - Uploads & File Management
 * Handles Deep Integration with Google Drive for user assets.
 */

const UPLOADS_CONFIG = {
  ROOT_FOLDER_NAME: 'User Data',
  ARCHIVE_FOLDER_NAME: '_Archive',
  MAX_EVIDENCE_COUNT: 7,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

/**
 * Uploads a file for a specific user.
 * Creates folder structure if it doesn't exist.
 * 
 * @param {string} userId - The ID of the user uploading the file
 * @param {string} dataUrl - The base64 encoded file data (data:image/...)
 * @param {string} type - 'profile' or 'evidence'
 * @param {string} category - Optional category for evidence (e.g., 'camera', 'sound')
 */
function uploadUserFile(userId, dataUrl, type, category) {
  try {
    const rootFolder = getOrCreateRootFolder();
    const userFolder = getOrCreateUserFolder(rootFolder, userId);
    
    // Parse data URL
    const contentType = dataUrl.substring(5, dataUrl.indexOf(';'));
    const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
    
    if (!UPLOADS_CONFIG.ALLOWED_TYPES.includes(contentType)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, `temp`);
    
    // Handle specific logic based on type
    let fileName;
    let file;
    
    if (type === 'profile') {
      fileName = `profile_${userId}.${contentType.split('/')[1]}`;
      // Check if existing profile pic exists and delete it to save space/keep clean
      const existing = userFolder.getFilesByName(fileName);
      if (existing.hasNext()) {
        existing.next().setTrashed(true);
      }
      file = userFolder.createFile(blob).setName(fileName);
    } 
    else if (type === 'evidence') {
      // Enforce limit
      const evidenceFiles = userFolder.getFiles();
      let count = 0;
      while (evidenceFiles.hasNext()) {
        const f = evidenceFiles.next();
        if (f.getName().startsWith('evidence_')) count++;
      }
      
      if (count >= UPLOADS_CONFIG.MAX_EVIDENCE_COUNT) {
        throw new Error(`Maximum evidence limit (${UPLOADS_CONFIG.MAX_EVIDENCE_COUNT}) reached.`);
      }
      
      const timestamp = new Date().getTime();
      const catSuffix = category ? `_${category}` : '';
      fileName = `evidence_${userId}${catSuffix}_${timestamp}.${contentType.split('/')[1]}`;
      file = userFolder.createFile(blob).setName(fileName);
    }
    
    // Set permissions to allow viewing (anyone with link)
    // In a strict enterprise env we might restrict this, but for a public-facing talent DB 
    // we need the images to be serving.
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      url: file.getDownloadUrl(), // or getThumbnailLink() for smaller previews
      fileId: file.getId(),
      name: fileName
    };
    
  } catch (err) {
    Logger.log('Upload Error: ' + err.toString());
    return { success: false, error: err.toString() };
  }
}

/**
 * Requests account deletion/archival.
 */
function archiveUserAccount(userId) {
  try {
    const rootFolder = getOrCreateRootFolder();
    const userFolder = getOrCreateUserFolder(rootFolder, userId); // Should exist
    
    // Create/Find Archive root
    const parent = rootFolder.getParents().next(); // Parent of User Data
    const archiveIter = parent.getFoldersByName(UPLOADS_CONFIG.ARCHIVE_FOLDER_NAME);
    let archiveRoot;
    
    if (archiveIter.hasNext()) {
      archiveRoot = archiveIter.next();
    } else {
      archiveRoot = parent.createFolder(UPLOADS_CONFIG.ARCHIVE_FOLDER_NAME);
    }
    
    // Move user folder to archive
    userFolder.moveTo(archiveRoot);
    
    // Update spreadsheet status (implementation specific, delegated to Auth/Talents)
    // deleteUserFromDB(userId); // logic would be here
    
    return { success: true };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// --- Helpers ---

function getOrCreateRootFolder() {
  // Use the active spreadsheet's parent folder as the anchor
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ssFile = DriveApp.getFileById(ss.getId());
  const parent = ssFile.getParents().next();
  
  const folders = parent.getFoldersByName(UPLOADS_CONFIG.ROOT_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parent.createFolder(UPLOADS_CONFIG.ROOT_FOLDER_NAME);
  }
}

function getOrCreateUserFolder(root, userId) {
  const folders = root.getFoldersByName(userId);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return root.createFolder(userId);
  }
}

/**
 * ICUNI CONNECT — Drive Manager
 * State-of-the-art hierarchical folder architecture.
 * 
 * Root: ICUNI Connect
 * ├── _System/
 * │   ├── Backups/
 * │   ├── Exports/
 * │   ├── Templates/
 * │   └── Logs/
 * ├── Talents/
 * │   └── [TalentName_TalentID]/
 * │       ├── Profile/          ← headshots, profile images (max 5)
 * │       ├── Portfolio/        ← showreels, BTS, work samples
 * │       └── Documents/       ← contracts, receipts, ID verification
 * ├── Projects/
 * │   └── [ProjectTitle_ProjectID]/
 * │       ├── Pre-Production/   ← scripts, storyboards, mood boards
 * │       ├── Production/       ← call sheets, shooting schedules
 * │       ├── Post-Production/  ← rough cuts, deliverables
 * │       ├── Deal Memos/       ← generated PDF memos per request
 * │       ├── Lineup/           ← talent headshots for this project
 * │       └── Assets/           ← logos, graphics, posters
 * └── Requests/
 *     └── [RequestID]/
 *         ├── Memos/            ← individual deal memo PDFs
 *         └── Responses/        ← signed responses, attachments
 */

// ─── Folder tree definition ────────────────────────────
var DRIVE_TREE = {
  SYSTEM:        '_System',
  BACKUPS:       '_System/Backups',
  EXPORTS:       '_System/Exports',
  TEMPLATES:     '_System/Templates',
  LOGS:          '_System/Logs',
  TALENTS_ROOT:  'Talents',
  PROJECTS_ROOT: 'Projects',
  REQUESTS_ROOT: 'Requests'
};

var TALENT_SUBFOLDERS  = ['Profile', 'Portfolio', 'Documents'];
var PROJECT_SUBFOLDERS = ['Pre-Production', 'Production', 'Post-Production', 'Deal Memos', 'Lineup', 'Assets'];
var REQUEST_SUBFOLDERS = ['Memos', 'Responses'];

// ─── Initialize the full folder tree ────────────────────
function initDriveFolders_() {
  var root = getMainDriveFolder_();
  var results = [];

  // Create system folders
  var systemPaths = [
    DRIVE_TREE.SYSTEM,
    DRIVE_TREE.BACKUPS,
    DRIVE_TREE.EXPORTS,
    DRIVE_TREE.TEMPLATES,
    DRIVE_TREE.LOGS
  ];

  for (var i = 0; i < systemPaths.length; i++) {
    ensureFolderPath_(root, systemPaths[i]);
    results.push('✓ ' + systemPaths[i]);
  }

  // Create entity root folders
  ensureSubfolder_(root, DRIVE_TREE.TALENTS_ROOT);
  ensureSubfolder_(root, DRIVE_TREE.PROJECTS_ROOT);
  ensureSubfolder_(root, DRIVE_TREE.REQUESTS_ROOT);
  results.push('✓ Talents/, Projects/, Requests/');

  return { success: true, folders: results };
}

// ─── Create a talent's folder set ───────────────────────
function createTalentFolders_(talentName, talentId) {
  var root = getMainDriveFolder_();
  var talentsRoot = ensureSubfolder_(root, DRIVE_TREE.TALENTS_ROOT);

  // Sanitize name for folder: "Ama Darko" → "Ama Darko_TLN-a1b2c3d4"
  var safeName = sanitizeFolderName_(talentName) + '_' + talentId;
  var talentFolder = ensureSubfolder_(talentsRoot, safeName);

  for (var i = 0; i < TALENT_SUBFOLDERS.length; i++) {
    ensureSubfolder_(talentFolder, TALENT_SUBFOLDERS[i]);
  }

  return {
    folderId: talentFolder.getId(),
    folderUrl: talentFolder.getUrl(),
    subfolders: TALENT_SUBFOLDERS
  };
}

// ─── Create a project's folder set ──────────────────────
function createProjectFolders_(projectTitle, projectId) {
  var root = getMainDriveFolder_();
  var projectsRoot = ensureSubfolder_(root, DRIVE_TREE.PROJECTS_ROOT);

  var safeName = sanitizeFolderName_(projectTitle) + '_' + projectId;
  var projectFolder = ensureSubfolder_(projectsRoot, safeName);

  for (var i = 0; i < PROJECT_SUBFOLDERS.length; i++) {
    ensureSubfolder_(projectFolder, PROJECT_SUBFOLDERS[i]);
  }

  return {
    folderId: projectFolder.getId(),
    folderUrl: projectFolder.getUrl(),
    subfolders: PROJECT_SUBFOLDERS
  };
}

// ─── Create a request's folder set ──────────────────────
function createRequestFolders_(requestId) {
  var root = getMainDriveFolder_();
  var requestsRoot = ensureSubfolder_(root, DRIVE_TREE.REQUESTS_ROOT);
  var requestFolder = ensureSubfolder_(requestsRoot, requestId);

  for (var i = 0; i < REQUEST_SUBFOLDERS.length; i++) {
    ensureSubfolder_(requestFolder, REQUEST_SUBFOLDERS[i]);
  }

  return {
    folderId: requestFolder.getId(),
    folderUrl: requestFolder.getUrl()
  };
}

// ─── Upload a file to a specific entity subfolder ───────
/**
 * @param {string} entityFolderId - The entity's root folder ID
 * @param {string} subfolder - e.g. 'Profile', 'Portfolio'
 * @param {Blob} blob - File blob
 * @param {string} filename - Desired filename
 * @returns {{ fileId, fileUrl, thumbnailUrl }}
 */
function uploadToEntityFolder_(entityFolderId, subfolder, blob, filename) {
  var entityFolder = DriveApp.getFolderById(entityFolderId);
  var targetFolder = ensureSubfolder_(entityFolder, subfolder);

  // Check for existing file with same name (overwrite)
  var existing = targetFolder.getFilesByName(filename);
  if (existing.hasNext()) {
    existing.next().setTrashed(true);
  }

  var file = targetFolder.createFile(blob.setName(filename));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w400'
  };
}

// ─── Move entity folder to deletion staging ─────────────
function moveToDeleteStaging_(entityFolderId) {
  var root = getMainDriveFolder_();
  var systemFolder = ensureSubfolder_(root, DRIVE_TREE.SYSTEM);
  var deletionStaging = ensureSubfolder_(systemFolder, 'DeletionStaging');

  var folder = DriveApp.getFolderById(entityFolderId);
  var timestamp = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd_HH-mm');
  folder.setName('[DELETED_' + timestamp + '] ' + folder.getName());
  folder.moveTo(deletionStaging);

  return { success: true };
}

// ─── Permanently delete staged folders older than 30 days ─
function purgeDeletedFolders_() {
  var root = getMainDriveFolder_();
  var systemFolder = ensureSubfolder_(root, DRIVE_TREE.SYSTEM);
  var staging = ensureSubfolder_(systemFolder, 'DeletionStaging');

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  var folders = staging.getFolders();
  var purged = 0;

  while (folders.hasNext()) {
    var folder = folders.next();
    if (folder.getDateCreated() < cutoff) {
      folder.setTrashed(true);
      purged++;
    }
  }

  return { purged: purged };
}

// ─── Generate a backup of all sheet data ────────────────
function createBackup_() {
  var root = getMainDriveFolder_();
  var backupsFolder = ensureFolderPath_(root, DRIVE_TREE.BACKUPS);

  var ss = getSpreadsheet_();
  var timestamp = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd_HH-mm');
  var backupName = 'ICUNI_Connect_Backup_' + timestamp;

  // Copy entire spreadsheet
  var copy = ss.copy(backupName);
  var file = DriveApp.getFileById(copy.getId());
  file.moveTo(backupsFolder);

  // Clean old backups (keep last 10)
  var files = backupsFolder.getFiles();
  var allFiles = [];
  while (files.hasNext()) { allFiles.push(files.next()); }
  allFiles.sort(function(a, b) { return b.getDateCreated() - a.getDateCreated(); });

  for (var i = 10; i < allFiles.length; i++) {
    allFiles[i].setTrashed(true);
  }

  return { success: true, backupId: file.getId(), name: backupName, kept: Math.min(allFiles.length, 10) };
}

// ═══════════════════════════════════════════════════════
// INTERNAL HELPERS
// ═══════════════════════════════════════════════════════

function ensureSubfolder_(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function ensureFolderPath_(root, path) {
  var parts = path.split('/');
  var current = root;
  for (var i = 0; i < parts.length; i++) {
    current = ensureSubfolder_(current, parts[i]);
  }
  return current;
}

function sanitizeFolderName_(name) {
  return String(name)
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 80);
}

/**
 * ICUNI CONNECT — Authentication (Multi-Spreadsheet)
 * Sessions stored in Activity spreadsheet.
 * Users stored in Core spreadsheet.
 * 
 * Auth methods:
 *   1. Google Sign-In (idToken)
 *   2. Email/Phone + 4-digit PIN
 */

// ─── PIN Hashing ─────────────────────────────────────────
function hashPin_(pin) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pin + '_icuni_salt_v2');
  return raw.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

// ─── Session Creation ────────────────────────────────────
function createSession_(userId) {
  var sessionId = Utilities.getUuid();
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  appendRow_('Sessions', [sessionId, userId, now_(), expiry.toISOString(), '', '', '']);
  return { token: sessionId, expiresAt: expiry.toISOString() };
}

function buildUserResponse_(userRow) {
  return {
    id: userRow[COL.USERS.ID],
    name: userRow[COL.USERS.NAME],
    email: userRow[COL.USERS.EMAIL],
    role: userRow[COL.USERS.ROLE],
    avatar: userRow[COL.USERS.AVATAR_URL],
    phone: userRow[COL.USERS.PHONE] || '',
    hasPin: !!(userRow[COL.USERS.PIN_HASH]),
  };
}

// ═══════════════════════════════════════════════════════════
// LOGIN — Google OAuth (existing flow)
// ═══════════════════════════════════════════════════════════

function handleLogin_(body) {
  // ── PIN-based login ──────────────────────────────────────
  if (body.identifier && body.pin) {
    return handlePinLogin_(body);
  }

  // ── First-time registration (identifier only, no pin yet) ─
  if (body.identifier && body.action === 'register') {
    return handleRegister_(body);
  }

  // ── Google OAuth login ───────────────────────────────────
  var idToken = body.idToken;
  if (!idToken) return { error: 'Missing credentials. Provide idToken OR identifier + pin.' };

  var payload;
  try { payload = verifyGoogleIdToken_(idToken); }
  catch (e) { return { error: 'Invalid Google ID token: ' + e.message }; }

  var email = payload.email;
  var name = payload.name || email.split('@')[0];
  var picture = payload.picture || '';
  var googleId = payload.sub;

  var usersSheet = getSheet_('Users');
  var usersData = usersSheet.getDataRange().getValues();
  var existingRow = -1;

  for (var i = 1; i < usersData.length; i++) {
    if (usersData[i][COL.USERS.EMAIL] === email || usersData[i][COL.USERS.GOOGLE_ID] === googleId) {
      existingRow = i + 1;
      break;
    }
  }

  var session, userId, role;

  if (existingRow > 0) {
    userId = usersData[existingRow - 1][COL.USERS.ID];
    role = usersData[existingRow - 1][COL.USERS.ROLE] || USER_ROLES.PM;
    usersSheet.getRange(existingRow, COL.USERS.LAST_LOGIN + 1).setValue(now_());
    usersSheet.getRange(existingRow, COL.USERS.AVATAR_URL + 1).setValue(picture);
    usersSheet.getRange(existingRow, COL.USERS.NAME + 1).setValue(name);
    session = createSession_(userId);
    logSystem_('INFO', 'LOGIN_GOOGLE', email, 'Existing user login');
    return { data: { token: session.token, user: buildUserResponse_(usersData[existingRow - 1]) } };
  } else {
    userId = getNextId_('USR');
    var newRow = [userId, name, email, picture, USER_ROLES.PM, googleId, 'GHS', false, now_(), now_(), 'active', '', ''];
    usersSheet.appendRow(newRow);
    session = createSession_(userId);
    logSystem_('INFO', 'LOGIN_GOOGLE', email, 'New user created: ' + userId);
    return { data: { token: session.token, user: { id: userId, name: name, email: email, role: USER_ROLES.PM, avatar: picture, phone: '', hasPin: false } } };
  }
}

// ═══════════════════════════════════════════════════════════
// LOGIN — PIN-based (email/phone + 4-digit PIN)
// ═══════════════════════════════════════════════════════════

function handlePinLogin_(body) {
  var identifier = String(body.identifier || '').trim().toLowerCase();
  var pin = String(body.pin || '').trim();

  if (!identifier) return { error: 'Please enter your email or phone number.' };
  if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return { error: 'PIN must be exactly 4 digits.' };

  var usersSheet = getSheet_('Users');
  var usersData = usersSheet.getDataRange().getValues();
  var pinHash = hashPin_(pin);

  // Find user by email or phone
  for (var i = 1; i < usersData.length; i++) {
    var email = String(usersData[i][COL.USERS.EMAIL] || '').toLowerCase();
    var phone = String(usersData[i][COL.USERS.PHONE] || '').replace(/[\s\-\(\)]/g, '');
    var identClean = identifier.replace(/[\s\-\(\)]/g, '');

    if (email === identifier || phone === identClean || (phone && identClean.endsWith(phone.slice(-9)))) {
      // User found — check PIN
      var storedHash = usersData[i][COL.USERS.PIN_HASH];

      if (!storedHash) {
        return { error: 'no_pin', message: 'No PIN set. Please set up your 4-digit PIN first.' };
      }

      if (storedHash !== pinHash) {
        logSystem_('WARN', 'LOGIN_PIN_FAIL', email, 'Incorrect PIN attempt');
        return { error: 'Incorrect PIN. Please try again.' };
      }

      if (usersData[i][COL.USERS.STATUS] !== 'active') {
        return { error: 'Account is not active.' };
      }

      // Success — update last login + create session
      usersSheet.getRange(i + 1, COL.USERS.LAST_LOGIN + 1).setValue(now_());
      var session = createSession_(usersData[i][COL.USERS.ID]);
      logSystem_('INFO', 'LOGIN_PIN', email, 'PIN login successful');

      return { data: { token: session.token, user: buildUserResponse_(usersData[i]) } };
    }
  }

  return { error: 'No account found with that email or phone number.' };
}

// ═══════════════════════════════════════════════════════════
// REGISTER — First-time user (creates account, prompts PIN)
// ═══════════════════════════════════════════════════════════

function handleRegister_(body) {
  var identifier = String(body.identifier || '').trim().toLowerCase();
  var name = String(body.name || '').trim();

  if (!identifier) return { error: 'Please enter your email or phone number.' };

  var isEmail = identifier.indexOf('@') > -1;
  var isPhone = /^\+?\d{8,15}$/.test(identifier.replace(/[\s\-\(\)]/g, ''));

  if (!isEmail && !isPhone) return { error: 'Please enter a valid email address or phone number.' };

  var usersSheet = getSheet_('Users');
  var usersData = usersSheet.getDataRange().getValues();

  // Check if user already exists
  for (var i = 1; i < usersData.length; i++) {
    var email = String(usersData[i][COL.USERS.EMAIL] || '').toLowerCase();
    var phone = String(usersData[i][COL.USERS.PHONE] || '').replace(/[\s\-\(\)]/g, '');
    var identClean = identifier.replace(/[\s\-\(\)]/g, '');

    if (email === identifier || phone === identClean) {
      // User exists — tell frontend to go to PIN step
      var hasPin = !!(usersData[i][COL.USERS.PIN_HASH]);
      return {
        data: {
          exists: true, hasPin: hasPin,
          userId: usersData[i][COL.USERS.ID],
          name: usersData[i][COL.USERS.NAME],
        }
      };
    }
  }

  // New user — create without PIN (PIN set in next step)
  var userId = getNextId_('USR');
  var displayName = name || (isEmail ? identifier.split('@')[0] : 'User');
  var emailVal = isEmail ? identifier : '';
  var phoneVal = isPhone ? identifier : '';

  usersSheet.appendRow([
    userId, displayName, emailVal, '', USER_ROLES.PM, '', 'GHS', false,
    now_(), now_(), 'active', phoneVal, ''
  ]);

  logSystem_('INFO', 'REGISTER', identifier, 'New user created: ' + userId + ' (PIN pending)');

  return {
    data: {
      exists: false, hasPin: false,
      userId: userId, name: displayName,
    }
  };
}

// ═══════════════════════════════════════════════════════════
// PIN MANAGEMENT — Setup / Change
// ═══════════════════════════════════════════════════════════

/**
 * Set PIN for the first time (no auth required, identified by userId from register flow)
 */
function handleSetPin_(body) {
  var userId = body.userId;
  var pin = String(body.pin || '').trim();

  if (!userId) return { error: 'Missing userId.' };
  if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return { error: 'PIN must be exactly 4 digits.' };

  var usersSheet = getSheet_('Users');
  var usersData = usersSheet.getDataRange().getValues();

  for (var i = 1; i < usersData.length; i++) {
    if (usersData[i][COL.USERS.ID] === userId) {
      // Only allow setting if no PIN exists yet
      if (usersData[i][COL.USERS.PIN_HASH]) {
        return { error: 'PIN already set. Use changePin to update.' };
      }

      var pinHash = hashPin_(pin);
      usersSheet.getRange(i + 1, COL.USERS.PIN_HASH + 1).setValue(pinHash);
      logSystem_('INFO', 'PIN_SET', userId, 'PIN created for user');

      // Auto-login after PIN setup
      var session = createSession_(userId);
      usersSheet.getRange(i + 1, COL.USERS.LAST_LOGIN + 1).setValue(now_());

      return { data: { token: session.token, user: buildUserResponse_(usersData[i]) } };
    }
  }

  return { error: 'User not found.' };
}

/**
 * Change PIN (auth required — needs current PIN or session token)
 */
function handleChangePin_(body, user) {
  var currentPin = String(body.currentPin || '').trim();
  var newPin = String(body.newPin || '').trim();

  if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
    return { error: 'New PIN must be exactly 4 digits.' };
  }

  var usersSheet = getSheet_('Users');
  var usersData = usersSheet.getDataRange().getValues();

  for (var i = 1; i < usersData.length; i++) {
    if (usersData[i][COL.USERS.ID] === user.id) {
      var storedHash = usersData[i][COL.USERS.PIN_HASH];

      // If user has a PIN, verify current PIN
      if (storedHash) {
        if (!currentPin) return { error: 'Please enter your current PIN.' };
        if (hashPin_(currentPin) !== storedHash) return { error: 'Current PIN is incorrect.' };
      }

      // Set new PIN
      var newHash = hashPin_(newPin);
      usersSheet.getRange(i + 1, COL.USERS.PIN_HASH + 1).setValue(newHash);
      logSystem_('INFO', 'PIN_CHANGE', user.id, 'PIN changed');

      return { data: { success: true, message: 'PIN updated successfully.' } };
    }
  }

  return { error: 'User not found.' };
}

// ═══════════════════════════════════════════════════════════
// GOOGLE TOKEN VERIFICATION
// ═══════════════════════════════════════════════════════════

function verifyGoogleIdToken_(idToken) {
  var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + idToken;
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) throw new Error('Token verification failed');
  return JSON.parse(response.getContentText());
}

// ═══════════════════════════════════════════════════════════
// SESSION VALIDATION
// ═══════════════════════════════════════════════════════════

function validateSession_(token) {
  if (!token) return null;

  var sessions = readAllShards_('Sessions', COL.SESSIONS);
  for (var i = 0; i < sessions.length; i++) {
    var s = sessions[i];
    if (s.SESSION_ID === token) {
      if (s.REVOKED_AT) return null;
      var expiry = new Date(s.EXPIRES_AT);
      if (expiry < new Date()) return null;

      var users = sheetToObjects_('Users', COL.USERS);
      for (var j = 0; j < users.length; j++) {
        if (users[j].ID === s.USER_ID && users[j].STATUS === 'active') {
          return {
            id: users[j].ID,
            name: users[j].NAME,
            email: users[j].EMAIL,
            role: users[j].ROLE,
            avatar: users[j].AVATAR_URL,
            phone: users[j].PHONE || '',
            hasPin: !!(users[j].PIN_HASH),
            _row: j + 2
          };
        }
      }
    }
  }
  return null;
}

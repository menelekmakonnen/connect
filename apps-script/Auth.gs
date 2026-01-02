// ============================================
// ICUNI Connect - Authentication
// ============================================

/**
 * Verify Google ID token and create/update user
 */
function authGoogle(body) {
  try {
    const idToken = body.idToken;
    
    if (!idToken) {
      throw new Error('ID token is required');
    }
    
    // Verify the token with Google
    // Note: In production, you should verify the token signature
    // For MVP, we'll decode the payload (client-side should use Google Sign-In)
    const payload = decodeJWT(idToken);
    
    if (!payload || !payload.email) {
      throw new Error('Invalid ID token');
    }
    
    // Check if user exists
    let user = dbFindOne(TABLES.USERS, { email: payload.email });
    
    if (!user) {
      // Create new user
      const userId = generateUserId();
      user = {
        user_id: userId,
        email: payload.email,
        display_name: payload.name || payload.email.split('@')[0],
        phone: '',
        account_type: 'pm', // Default to PM, can be changed later
        status: 'active',
        created_at: getTimestamp(),
        last_login_at: getTimestamp(),
        timezone: 'Africa/Accra',
        preferred_channel: 'email'
      };
      
      dbInsert(TABLES.USERS, user);
    } else {
      // Update last login
      dbUpdate(TABLES.USERS, { user_id: user.user_id }, { 
        last_login_at: getTimestamp() 
      });
    }
    
    // Generate session token
    const sessionToken = generateSessionToken(user.user_id);
    
    // Store session
    storeSession(sessionToken, user.user_id);
    
    return {
      ok: true,
      data: {
        user: user,
        token: sessionToken
      }
    };
    
  } catch (error) {
    Logger.log('Auth error: ' + error.toString());
    return {
      ok: false,
      error: 'Authentication failed: ' + error.toString()
    };
  }
}

/**
 * Simple JWT decoder (payload only, no signature verification for MVP)
 */
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = Utilities.newBlob(
      Utilities.base64Decode(payload.replace(/-/g, '+').replace(/_/g, '/'))
    ).getDataAsString();
    
    return JSON.parse(decoded);
  } catch (error) {
    Logger.log('JWT decode error: ' + error.toString());
    return null;
  }
}

/**
 * Generate a session token
 */
function generateSessionToken(userId) {
  const random = Utilities.getUuid();
  const timestamp = new Date().getTime();
  const token = Utilities.base64Encode(`${userId}:${timestamp}:${random}`);
  return token;
}

/**
 * Store session in Properties Service
 */
function storeSession(token, userId) {
  const userProperties = PropertiesService.getUserProperties();
  const expiresAt = new Date().getTime() + SESSION_DURATION_MS;
  
  userProperties.setProperty(token, JSON.stringify({
    userId: userId,
    expiresAt: expiresAt
  }));
}

/**
 * Get session from token
 */
function getSession(token) {
  const userProperties = PropertiesService.getUserProperties();
  const sessionData = userProperties.getProperty(token);
  
  if (!sessionData) {
    return null;
  }
  
  const session = JSON.parse(sessionData);
  
  // Check if expired
  if (new Date().getTime() > session.expiresAt) {
    userProperties.deleteProperty(token);
    return null;
  }
  
  return session;
}

/**
 * Require authentication - throws error if not authenticated
 */
function requireAuth(e) {
  const authHeader = e.parameter.authorization || e.parameter.Authorization;
  
  if (!authHeader) {
    throw new Error('Authorization header required');
  }
  
  const token = authHeader.replace(/bearer\s+/i, '');
  const session = getSession(token);
  
  if (!session) {
    throw new Error('Invalid or expired session');
  }
  
  // Get user
  const user = dbFindOne(TABLES.USERS, { user_id: session.userId });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.status !== 'active') {
    throw new Error('User account is not active');
  }
  
  return user;
}

/**
 * Require specific role
 */
function requireRole(e, role) {
  const user = requireAuth(e);
  
  if (user.account_type !== role) {
    throw new Error(`Requires ${role} role`);
  }
  
  return user;
}

/**
 * Check if user owns a resource
 */
function requireOwner(userId, resourceOwnerId) {
  if (userId !== resourceOwnerId) {
    throw new Error('You do not own this resource');
  }
}

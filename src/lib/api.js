/**
 * ICUNI Connect — API Client
 * Cache-aware API abstraction adapted from PrintShop api.js
 * 
 * For reads: returns cached data instantly, background-refreshes silently.
 * For mutations: fires request, invalidates cache on success.
 */

import {
  CACHEABLE, INVALIDATION_MAP, PREFETCH_ACTIONS,
  cacheKey, getCached, setCache, invalidate, clearAll, initCache,
} from './cache.js';
import { isDemoSession, resolveDemoCall } from './demoData.js';

/* ═══════════════════════════════════════════════════════
   AUTH STATE — Session management
   ═══════════════════════════════════════════════════════ */

const AUTH_TOKEN_KEY = 'ic_token';
const AUTH_USER_KEY = 'ic_user';

export const authState = {
  getToken() {
    try { return localStorage.getItem(AUTH_TOKEN_KEY); } catch { return null; }
  },
  setToken(token) {
    try { localStorage.setItem(AUTH_TOKEN_KEY, token); } catch {}
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'); } catch { return null; }
  },
  setUser(user) {
    try { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)); } catch {}
  },
  setSession(token, user) {
    this.setToken(token);
    this.setUser(user);
  },
  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },
  logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {}
    clearAll();
  },
};

/* ═══════════════════════════════════════════════════════
   API BASE URL
   ═══════════════════════════════════════════════════════ */

// In development, Vite proxy sends /api/* to the Apps Script deployment.
// In production, this is the deployed webapp URL.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Actions that should work without authentication (public reads)
const PUBLIC_ACTIONS = new Set([
  'talentsSearch', 'talentsGet', 'rolesList', 'configGet',
]);

/* ═══════════════════════════════════════════════════════
   CORE API CALL — cache-aware
   ═══════════════════════════════════════════════════════ */

/**
 * Make a cache-aware API call.
 * 
 * @param {string} action - API action name (e.g. 'talentsSearch')
 * @param {Object} [data={}] - Request payload
 * @param {Object} [opts={}] - { skipCache, signal }
 * @returns {Promise<any>}
 */
export async function apiCall(action, data = {}, opts = {}) {
  // ── Demo mode: return mock data ──────────────────────
  if (isDemoSession()) {
    const demoResult = resolveDemoCall(action, data);
    if (demoResult !== null) return demoResult;
  }

  const isCacheable = CACHEABLE[action];
  const key = isCacheable ? cacheKey(action, data) : null;

  // ── Cacheable READ: return cached instantly ──────────
  if (isCacheable && !opts.skipCache) {
    const cached = getCached(key);
    if (cached !== null) {
      // Background refresh (fire-and-forget)
      fetchFromServer(action, data).then(fresh => {
        if (fresh !== null) setCache(key, fresh);
      }).catch(() => {});
      
      return cached;
    }
  }

  // ── Cache miss or mutation: fetch from server ────────
  const result = await fetchFromServer(action, data, opts.signal);

  // Cache successful reads
  if (isCacheable && key && result !== null) {
    setCache(key, result);
  }

  // Invalidate on mutations
  const invalidKeys = INVALIDATION_MAP[action];
  if (invalidKeys) {
    if (invalidKeys.length === 0 && action === 'rescan') {
      clearAll();
    } else {
      invalidate(invalidKeys);
    }
  }

  return result;
}

/**
 * Force a fresh fetch (bypass cache).
 */
export async function apiCallFresh(action, data = {}) {
  return apiCall(action, data, { skipCache: true });
}

/* ═══════════════════════════════════════════════════════
   SERVER FETCH
   ═══════════════════════════════════════════════════════ */

async function fetchFromServer(action, data = {}, signal) {
  const rawToken = authState.getToken();
  // For demo users, only send token on non-public actions
  const isDemo = rawToken === 'demo-token';
  const token = (isDemo && PUBLIC_ACTIONS.has(action)) ? undefined : rawToken;

  // Apps Script web apps redirect POSTs (302), so we must use
  // redirect: 'follow' and pass token in body (headers are lost on redirect).
  const response = await fetch(API_BASE, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, token: token || undefined, ...data }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Network error');
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  if (result.error) {
    // Auth failures — auto-logout (but not for demo users)
    if (!isDemo && (result.error.includes('Unauthorized') || result.error.includes('expired'))) {
      authState.logout();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    throw new Error(result.error);
  }

  return result.data !== undefined ? result.data : result;
}

/* ═══════════════════════════════════════════════════════
   PREFETCH — Boot-time data loading
   ═══════════════════════════════════════════════════════ */

export function prefetchAll() {
  PREFETCH_ACTIONS.forEach(action => {
    const key = cacheKey(action, {});
    if (!getCached(key)) {
      fetchFromServer(action, {}).then(data => {
        if (data) setCache(key, data);
      }).catch(() => {});
    }
  });
}

/* ═══════════════════════════════════════════════════════
   DOMAIN API FUNCTIONS — Convenience wrappers
   ═══════════════════════════════════════════════════════ */

// ── Auth ──
export const login = (idToken) => apiCall('login', { idToken });
export const loginWithPin = (identifier, pin) => apiCall('login', { identifier, pin });
export const register = (identifier, name) => apiCall('register', { identifier, name });
export const setPin = (userId, pin) => apiCall('setPin', { userId, pin });
export const changePin = (currentPin, newPin) => apiCall('changePin', { currentPin, newPin });
export const logout = () => { authState.logout(); window.location.href = '/login'; };

// ── Talents ──
export const searchTalents = (filters) => apiCall('talentsSearch', filters);
export const getTalent = (id) => apiCall('talentsGet', { id });
export const createTalent = (data) => apiCall('talentsCreate', data);
export const updateTalent = (id, data) => apiCall('talentsUpdate', { id, ...data });
export const deleteTalent = (id) => apiCall('talentsDelete', { id });

// ── Projects ──
export const listProjects = (filters) => apiCall('projectsList', filters);
export const getProject = (id) => apiCall('projectsGet', { id });
export const createProject = (data) => apiCall('projectsCreate', data);
export const updateProject = (id, data) => apiCall('projectsUpdate', { id, ...data });
export const deleteProject = (id) => apiCall('projectsDelete', { id });
export const addRoleSlot = (projectId, slot) => apiCall('projectsAddSlot', { projectId, ...slot });
export const assignTalent = (projectId, slotId, talentId) => apiCall('projectsAssign', { projectId, slotId, talentId });

// ── Requests ──
export const listRequests = (filters) => apiCall('requestsList', filters);
export const getRequest = (id) => apiCall('requestsGet', { id });
export const createRequest = (data) => apiCall('requestsCreate', data);
export const sendRequest = (id) => apiCall('requestsSend', { id });
export const respondToRequest = (token, response) => apiCall('requestsRespond', { token, ...response });

// ── Roles ──
export const listRoles = () => apiCall('rolesList');

// ── Config ──
export const getConfig = () => apiCall('configGet');

// ── Analytics ──
export const getAnalytics = (range) => apiCall('analyticsGet', { range });

// ── Notifications ──
export const listNotifications = () => apiCall('notificationsList');
export const markRead = (id) => apiCall('notificationsRead', { id });
export const clearNotifications = () => apiCall('notificationsClear');

// ── Profile ──
export const getProfile = () => apiCall('userProfile');
export const updateProfile = (data) => apiCall('profileUpdate', data);

/* ═══════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════ */

export function initApi() {
  initCache();
  if (authState.isLoggedIn()) {
    prefetchAll();
  }
}

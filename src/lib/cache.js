/**
 * ICUNI Connect — Client-Side Cache
 * Stale-while-revalidate pattern adapted from PrintShop cache.js
 * 
 * Lifecycle:
 *   - Cached reads return instantly, background-refresh silently
 *   - Mutations invalidate related cache keys
 *   - Cache clears on: page reload, midnight, logout, manual refresh
 */

const PREFIX = 'ic_c:';
const DATE_KEY = 'ic_cache_date';
let autoTimer = null;
const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

/* ─── Cacheable read actions ────────────────────────────── */
export const CACHEABLE = {
  talentsSearch:     true,
  talentsGet:        true,
  projectsList:      true,
  projectsGet:       true,
  rolesList:         true,
  requestsList:      true,
  requestsGet:       true,
  configGet:         true,
  analyticsGet:      true,
  notificationsList: true,
  userProfile:       true,
};

/* ─── Mutation → cache keys to invalidate ───────────────── */
export const INVALIDATION_MAP = {
  talentsCreate:       ['talentsSearch'],
  talentsUpdate:       ['talentsSearch', 'talentsGet'],
  talentsMedia:        ['talentsGet'],
  talentsDelete:       ['talentsSearch', 'talentsGet'],
  projectsCreate:      ['projectsList'],
  projectsUpdate:      ['projectsList', 'projectsGet'],
  projectsDelete:      ['projectsList', 'projectsGet'],
  projectsAddSlot:     ['projectsGet'],
  projectsAssign:      ['projectsGet', 'talentsGet'],
  requestsCreate:      ['requestsList', 'projectsGet'],
  requestsSend:        ['requestsList', 'requestsGet'],
  requestsRespond:     ['requestsList', 'requestsGet', 'projectsGet'],
  configUpdate:        ['configGet'],
  notificationsRead:   ['notificationsList'],
  notificationsClear:  ['notificationsList'],
  profileUpdate:       ['userProfile', 'talentsGet'],
  rescan:              [], // triggers clearAll
};

/* ─── Prefetchable on boot ──────────────────────────────── */
export const PREFETCH_ACTIONS = ['rolesList', 'configGet'];

/* ─── Build a deterministic cache key ───────────────────── */
export function cacheKey(action, params) {
  let paramStr = '';
  if (params && Object.keys(params).length > 0) {
    try { paramStr = ':' + JSON.stringify(params); } catch {}
  }
  return PREFIX + action + paramStr;
}

/* ─── Get cached entry ──────────────────────────────────── */
export function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

/* ─── Store response ────────────────────────────────────── */
export function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage full — evict and retry
    clearAll();
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }
}

/* ─── Invalidate specific action keys ───────────────────── */
export function invalidate(actions) {
  if (!actions || actions.length === 0) return;
  const prefixes = actions.map(a => PREFIX + a);
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) {
      for (const p of prefixes) {
        if (k.startsWith(p)) { toRemove.push(k); break; }
      }
    }
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}

/* ─── Clear ALL cache entries ───────────────────────────── */
export function clearAll() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}

/* ─── Init on app boot ──────────────────────────────────── */
export function initCache() {
  // Midnight reset
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(DATE_KEY);
  if (lastDate && lastDate !== today) {
    clearAll();
  }
  localStorage.setItem(DATE_KEY, today);

  // Page reload detection
  try {
    const nav = performance.getEntriesByType('navigation');
    if (nav.length > 0 && nav[0].type === 'reload') {
      clearAll();
    }
  } catch {}

  startAutoRefresh();
}

/* ─── Auto-refresh timer ────────────────────────────────── */
export function startAutoRefresh() {
  stopAutoRefresh();
  autoTimer = setInterval(() => { clearAll(); }, AUTO_REFRESH_MS);
}

export function stopAutoRefresh() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

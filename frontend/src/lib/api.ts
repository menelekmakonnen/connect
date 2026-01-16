import { Project, Talent, Request, TalentLink, TalentRate, Role, RoleSlot, ProjectSummary, RequestInboxItem } from './types';

// ============================================================================
// ICUNI Connect - Frontend API Client
// ============================================================================

const API_BASE_URL = '/api/proxy'; // Server-side proxy endpoint

// Persistent cache using localStorage
const CACHE_KEY_PREFIX = 'icuni_api_cache_';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

function getFromCache(url: string) {
    if (typeof window === 'undefined') return null;
    try {
        const item = localStorage.getItem(CACHE_KEY_PREFIX + url);
        if (!item) return null;

        const cached = JSON.parse(item);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
        return null;
    } catch {
        return null;
    }
}

function saveToCache(url: string, data: unknown) {
    if (typeof window === 'undefined') return;
    try {
        const item = JSON.stringify({ data, timestamp: Date.now() });
        localStorage.setItem(CACHE_KEY_PREFIX + url, item);
    } catch {
        // Quota exceeded or other error
        console.warn('Failed to save to cache');
    }
}

function clearCache() {
    if (typeof window === 'undefined') return;
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch {
        console.warn('Failed to clear cache');
    }
}


/**
 * Generic API call wrapper
 */
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
        const cached = getFromCache(url);
        if (cached) {
            console.log(`[API] Cache hit: ${url}`);
            return cached;
        }
    } else {
        // Clear cache on any mutation (POST, PATCH, DELETE)
        // This ensures the user sees fresh data after making changes
        console.log(`[API] Clearing cache due to mutation: ${options.method}`);
        clearCache();
    }

    // Get token from storage
    const headers = new Headers(options.headers);

    // Auth is optional for MVP (backend is publicly accessible)
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('icuni_token') || '';

        // Fallback: Try reading from Zustand store persistence
        if (!token) {
            try {
                const storage = localStorage.getItem('icuni-auth');
                if (storage) {
                    const parsed = JSON.parse(storage);
                    token = parsed.state?.token || '';
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Ensure Content-Type is set if not already present
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...options,
        headers,
        // No need for 'mode: no-cors' or 'credentials: omit' anymore
        // The proxy handles the connection to Google
    };

    try {
        const response = await fetch(url, config);

        // Apps Script redirects to a GoogleUserContent URL for the actual response
        // ensure we handle that transparently

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = `${errorData.error} ${errorData.details || ''}`;
                }
            } catch (e) {
                // Could not parse error JSON, stick to status text
            }

            // Handle Auth Errors (401/403) or generic "Unauthorized" text
            if (response.status === 401 || response.status === 403 || errorMessage.toLowerCase().includes('invalid or expired session')) {
                console.warn('[API] Auth expired or invalid. Redirecting to login.');
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('icuni_token');
                    localStorage.removeItem('icuni-auth'); // Clear Zustand persistence if any
                    window.location.href = '/login?expired=true';
                }
            }

            throw new Error(errorMessage);
        }

        const result = await response.json();

        if (!result.ok) {
            // Handle specific API errors
            throw new Error(result.error || 'Unknown API error');
        }

        // Cache GET requests
        if (options.method === 'GET' || !options.method) {
            saveToCache(url, result.data);
        }

        return result.data as T;
    } catch (error) {
        console.error(`API Call Failed [${endpoint}]:`, error);
        throw error;
    }
}

// ============================================================================
// API Endpoints
// ============================================================================

export const api = {
    // Auth
    auth: {
        google: (idToken: string) =>
            apiCall('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) }),
        me: () =>
            apiCall<User>('/me', { method: 'GET' }),
        deleteAccount: () => apiCall('/auth/delete', { method: 'POST' }), // Archive flow
    },

    // Talents
    talents: {
        search: (params?: {
            query?: string;
            roles?: string;
            city?: string;
            availability?: string;
            verified_only?: boolean;
            budget_tier?: string;
            limit?: number;
            offset?: number;
        }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, String(value));
                    }
                });
            }
            const query = searchParams.toString();
            return apiCall<{ talents: Talent[]; total: number; limit: number; offset: number }>(
                `/talents${query ? `?${query}` : ''}`,
                { method: 'GET' }
            );
        },
        getById: (id: string) => apiCall<Talent>(`/talents/${id}`, { method: 'GET' }),
        create: (data: Partial<Talent>) =>
            apiCall<{ talent_id: string }>('/talents', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Talent>) =>
            apiCall(`/talents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    },

    // Projects
    projects: {
        list: (params?: { status?: string; type?: string; admin_view?: string }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value) searchParams.append(key, value);
                });
            }
            const query = searchParams.toString();
            return apiCall<ProjectSummary[]>(`/projects${query ? `?${query}` : ''}`, { method: 'GET' });
        },
        listByUser: (params?: { status?: string; type?: string }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value) searchParams.append(key, value);
                });
            }
            const query = searchParams.toString();
            return apiCall<ProjectSummary[]>(`/projects/my${query ? `?${query}` : ''}`, { method: 'GET' });
        },
        getById: (id: string) => apiCall<Project>(`/projects/${id}`, { method: 'GET' }),
        create: (data: any) => apiCall<{ project_id: string }>(`/projects`, { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => apiCall(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
        addToLineup: (projectId: string, data: { slot_id: string; talent_id: string }) =>
            apiCall(`/projects/${projectId}/lineup/add`, { method: 'POST', body: JSON.stringify(data) }),
    },

    // Requests
    requests: {
        inbox: () => apiCall<RequestInboxItem[]>(`/requests/inbox`, { method: 'GET' }),
        sent: () => apiCall<Request[]>(`/requests/sent`, { method: 'GET' }),
        send: (data: any) => apiCall(`/requests`, { method: 'POST', body: JSON.stringify(data) }),
        respond: (requestId: string, data: { status: string; message?: string }) =>
            apiCall(`/requests/${requestId}/respond`, { method: 'POST', body: JSON.stringify(data) }),
    },

    // Assets
    assets: {
        upload: (file: File, type: 'profile' | 'evidence', category?: string) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    apiCall('/assets/upload', {
                        method: 'POST',
                        body: JSON.stringify({
                            dataUrl: reader.result,
                            type,
                            category,
                            name: file.name
                        })
                    }).then(resolve).catch(reject);
                };
                reader.onerror = error => reject(error);
            });
        }
    },

    // Shortlists
    shortlists: {
        list: () => apiCall<{ id: string; name: string; talent_count: number; talents: string[] }[]>('/shortlists', { method: 'GET' }),
        create: (name: string) => apiCall<{ id: string; name: string }>('/shortlists', { method: 'POST', body: JSON.stringify({ name }) }),
        delete: (id: string) => apiCall(`/shortlists/${id}`, { method: 'DELETE' }),
        addTalent: (id: string, talentId: string) =>
            apiCall(`/shortlists/${id}/add`, { method: 'POST', body: JSON.stringify({ talent_id: talentId }) }),
        removeTalent: (id: string, talentId: string) =>
            apiCall(`/shortlists/${id}/remove`, { method: 'POST', body: JSON.stringify({ talent_id: talentId }) }),
    }
};

// ============================================================================
// Type Definitions
// ============================================================================

interface User {
    user_id: string;
    email: string;
    display_name: string;
    account_type: 'pm' | 'talent';
    status: string;
}

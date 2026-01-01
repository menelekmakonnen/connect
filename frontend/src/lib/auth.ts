import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    user_id: string;
    email: string;
    display_name: string;
    account_type: 'pm' | 'talent';
    status: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setAuth: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },

            clearAuth: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'icuni-auth',
        }
    )
);

// Auth utilities
export const useAuth = () => {
    const { user, token, isAuthenticated, isLoading, clearAuth } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        logout: clearAuth,
    };
};

export const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('icuni_token');
};

export const setStoredToken = (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('icuni_token', token);
};

export const clearStoredToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('icuni_token');
};

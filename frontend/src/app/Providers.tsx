'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    if (typeof window !== 'undefined' && clientId) {
        console.log('[Auth] Google Client ID loaded:', clientId.slice(0, 5) + '...' + clientId.slice(-5));
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}

'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
    const clientId = '806372876466-nadbksm3ctbafd72dk2njo83ds20g3je.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}

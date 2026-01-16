'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';

interface GoogleSignInButtonProps {
    onSuccess?: (response: any) => void;
    onError?: (error: Error) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    return (
        <div className="w-full flex justify-center flex-col items-center">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        if (credentialResponse.credential) {
                            setIsLoading(true);
                            console.log('Google Auth Success. Verifying with ICUNI backend...');
                            const result = await api.auth.google(credentialResponse.credential) as { user: any; token: string };

                            setAuth(result.user, result.token);
                            localStorage.setItem('icuni_token', result.token);

                            if (onSuccess) onSuccess(result);
                            if (!onSuccess) router.push('/dashboard');
                        }
                    } catch (error) {
                        console.error('Authentication check failed:', error);
                        if (onError) onError(error as Error);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                onError={() => {
                    console.error('Google Sign-In failed to initialize or execute');
                    if (onError) onError(new Error('Google Sign-In Failed'));
                }}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
                width="300"
                use_fedcm_for_prompt={true}
            />
            <div className="mt-4 text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-black opacity-50">
                Authorized Secure Access
            </div>
        </div>
    );
}

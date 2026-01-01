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
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        if (credentialResponse.credential) {
                            setIsLoading(true);
                            const result = await api.auth.google(credentialResponse.credential) as { user: any; token: string };
                            // Set auth state
                            setAuth(result.user, result.token);
                            // Store token
                            localStorage.setItem('icuni_token', result.token);

                            if (onSuccess) onSuccess(result);

                            // Default redirect if not handled by parent
                            if (!onSuccess) {
                                router.push('/dashboard');
                            }
                        }
                    } catch (error) {
                        console.error('Login failed:', error);
                        if (onError) onError(error as Error);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                onError={() => {
                    console.error('Login Failed');
                    if (onError) onError(new Error('Google Sign-In Failed'));
                }}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
                width="300"
            />
        </div>
    );
}

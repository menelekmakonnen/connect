'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuthStore } from '@/lib/auth';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuthStore();

    // Derive returnUrl directly from searchParams
    const returnUrl = searchParams.get('returnUrl')
        ? decodeURIComponent(searchParams.get('returnUrl')!)
        : '/dashboard';

    useEffect(() => {
        // If already authenticated, redirect
        if (isAuthenticated) {
            router.push(returnUrl);
        }
    }, [isAuthenticated, router, returnUrl]);

    const handleGoogleSuccess = async (response: unknown) => {
        try {
            console.log('Google sign-in success:', response);
            // Auth state is already set by GoogleSignInButton
            router.push(returnUrl);
        } catch (error) {
            console.error('Authentication error:', error);
        }
    };

    const handleGoogleError = (error: Error) => {
        console.error('Google sign-in error:', error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--role-camera)]/5 via-transparent to-[var(--role-hairmakeup)]/5" />

            <div className="relative w-full max-w-md">
                {/* Back to home */}
                <Link href="/" className="inline-block mb-6">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Button>
                </Link>

                <Card className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-glow)] mb-4">
                            <Sparkles className="text-[var(--accent-primary)]" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Welcome to ICUNI</h1>
                        <p className="text-[var(--text-secondary)]">
                            Sign in to manage your projects and connect with Ghana&apos;s top production talent
                        </p>
                    </div>

                    {/* Sign-in button */}
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-subtle)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[var(--bg-glass)] text-[var(--text-muted)]">
                                New here?
                            </span>
                        </div>
                    </div>

                    {/* Sign up link */}
                    <div className="text-center">
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Are you a talent looking to get booked?
                        </p>
                        <Link href="/register">
                            <Button variant="secondary" className="w-full">
                                Create Talent Profile
                            </Button>
                        </Link>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-[var(--text-muted)] text-center mt-8">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </Card>

                {/* Benefits */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-[var(--accent-primary)] mb-1">500+</p>
                        <p className="text-xs text-[var(--text-muted)]">Verified Talents</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--accent-primary)] mb-1">1,200+</p>
                        <p className="text-xs text-[var(--text-muted)]">Projects</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--accent-primary)] mb-1">24hr</p>
                        <p className="text-xs text-[var(--text-muted)]">Avg Response</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Store intended destination
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[var(--accent-primary)]" />
                    <p className="text-[var(--text-secondary)]">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render protected content until authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

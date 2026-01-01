'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // Default to Talent Registration
        router.push('/register/talent/profile');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full mb-4"></div>
                <p className="text-[var(--text-secondary)]">Redirecting to registration...</p>
            </div>
        </div>
    );
}

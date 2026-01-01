'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
    User,
    Briefcase,
    Building,
    ArrowRight,
    Loader2
} from 'lucide-react';

export default function PMProfileStep() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        display_name: user?.display_name || '',
        company: '',
        job_title: '',
        bio: '',
    });

    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto py-12 px-4 text-center">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Production Manager Sign Up</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Please sign in with Google to create your production account.
                    </p>
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => router.push('/login?returnUrl=/register/pm/profile')}
                    >
                        Sign in with Google
                    </Button>
                </Card>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple flow for PMs for now - directly to completion
        // In a real app, this would save to backend
        setTimeout(() => {
            router.push('/register/pm/complete');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <Card className="p-8">
                <h1 className="text-2xl font-bold mb-6">Production Manager Details</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                placeholder="e.g. Kwame Mensah"
                            />
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Company / Production House</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                placeholder="e.g. Frame Perfect Productions"
                            />
                        </div>
                    </div>

                    {/* Job Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.job_title}
                                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                placeholder="e.g. Producer, Casting Director"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Complete Registration
                                    <ArrowRight size={18} className="ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-[var(--text-secondary)]">
                        Looking for work instead?{' '}
                        <button
                            onClick={() => router.push('/register/talent/profile')}
                            className="text-[var(--accent-primary)] hover:underline font-medium bg-transparent border-none cursor-pointer"
                        >
                            Register as Talent
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}

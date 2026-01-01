'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
    User,
    MapPin,
    AlignLeft,
    ArrowRight,
    Loader2
} from 'lucide-react';

export default function TalentProfileStep() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        display_name: user?.display_name || '',
        headline: '',
        bio: '',
        city: 'Accra', // Default
        neighborhood: '',
    });

    const [loading, setLoading] = useState(false);

    // If not authenticated, we should probably prompt for it, 
    // but for MVP let's allow filling the form and then auth at the end?
    // Or strictly enforce auth first. 
    // Let's enforce auth first for simplicity in backend.

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto py-12 px-4 text-center">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Create your Talent Profile</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Please sign in with Google to start building your professional profile.
                    </p>
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => router.push('/login?returnUrl=/register/talent/profile')}
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

        // Save to localStorage to persist across steps
        localStorage.setItem('reg_step1', JSON.stringify(formData));

        // Navigate to next step
        router.push('/register/talent/details');
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-[var(--accent-primary)]">Step 1: Basic Info</span>
                    <span className="text-[var(--text-muted)]">Step 2: Details</span>
                </div>
                <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-[var(--accent-primary)]" />
                </div>
            </div>

            <Card className="p-8">
                <h1 className="text-2xl font-bold mb-6">Tell us about yourself</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Display Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                placeholder="e.g. Ama K. Abrebrese"
                            />
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Professional Headline <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            maxLength={60}
                            value={formData.headline}
                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                            className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 px-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                            placeholder="e.g. Editorial MUA & Special FX Artist"
                        />
                        <p className="text-xs text-[var(--text-muted)]">Short description of what you do (max 60 chars)</p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 min-h-[120px] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all resize-y"
                                placeholder="Share your experience, style, and what makes you unique..."
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                                <select
                                    aria-label="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all appearance-none"
                                >
                                    <option value="Accra">Accra</option>
                                    <option value="Kumasi">Kumasi</option>
                                    <option value="Takoradi">Takoradi</option>
                                    <option value="Tamale">Tamale</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Neighborhood</label>
                            <input
                                type="text"
                                value={formData.neighborhood}
                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 px-4 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
                                placeholder="e.g. East Legon"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Next: Role & Details
                                    <ArrowRight size={18} className="ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-[var(--text-secondary)]">
                        Looking to hire talent?{' '}
                        <button
                            onClick={() => router.push('/register/pm/profile')}
                            className="text-[var(--accent-primary)] hover:underline font-medium bg-transparent border-none cursor-pointer"
                        >
                            Register as Production Manager
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}

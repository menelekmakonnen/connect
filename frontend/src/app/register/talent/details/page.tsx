'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, RoleBadge } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
    Briefcase,
    DollarSign,
    Globe,
    Instagram,
    Check,
    Loader2,
    ArrowLeft
} from 'lucide-react';

// Predefined roles for MVP
const AVAILABLE_ROLES = [
    { id: 'ROLE_MUA_001', name: 'Makeup Artist' },
    { id: 'ROLE_HAIR_001', name: 'Hair Stylist' },
    { id: 'ROLE_COSTUME_001', name: 'Costume Designer' },
    { id: 'ROLE_SET_001', name: 'Set Designer' },
    { id: 'ROLE_LIGHT_001', name: 'Gaffer / Lighting' },
    { id: 'ROLE_SOUND_001', name: 'Sound Mixer' },
    { id: 'ROLE_DIR_001', name: 'Director' },
    { id: 'ROLE_DOP_001', name: 'Cinematographer' },
];

export default function TalentDetailsStep() {
    const router = useRouter();
    const { user } = useAuth();

    // Load step 1 data
    const [step1Data, setStep1Data] = useState<any>(null);

    useEffect(() => {
        const data = localStorage.getItem('reg_step1');
        if (!data) {
            router.push('/register/talent/profile');
            return;
        }
        setStep1Data(JSON.parse(data));
    }, [router]);

    // Form state
    const [formData, setFormData] = useState({
        roles: [] as string[],
        rate_min: '',
        rate_max: '',
        currency: 'GHS',
        instagram: '',
        website: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleRole = (roleId: string) => {
        if (formData.roles.includes(roleId)) {
            setFormData({ ...formData, roles: formData.roles.filter(r => r !== roleId) });
        } else {
            if (formData.roles.length >= 3) return; // Max 3
            setFormData({ ...formData, roles: [...formData.roles, roleId] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.roles.length === 0) {
            setError('Please select at least one role');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Combine data
            const finalData = {
                ...step1Data,
                roles: formData.roles,
                rate_range: {
                    min: parseInt(formData.rate_min) || 0,
                    max: parseInt(formData.rate_max) || 0,
                    currency: formData.currency,
                },
                links: [
                    ...(formData.instagram ? [{ type: 'instagram', url: formData.instagram, label: 'Instagram' }] : []),
                    ...(formData.website ? [{ type: 'website', url: formData.website, label: 'Portfolio' }] : []),
                ],
                // Add required backend fields
                email: user?.email,
                user_id: user?.user_id, // If available, or let backend handle it from token
                status: 'active',
            };

            // Call API
            await api.talents.create(finalData);

            // Clear temp data
            localStorage.removeItem('reg_step1');

            // Go to success
            router.push('/register/talent/complete');

        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.message || 'Failed to create profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!step1Data) return null;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[var(--text-muted)]">Step 1: Basic Info</span>
                    <span className="font-medium text-[var(--accent-primary)]">Step 2: Details</span>
                </div>
                <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[var(--accent-primary)]" />
                </div>
            </div>

            <Card className="p-8">
                <h1 className="text-2xl font-bold mb-6">Professional Details</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Roles */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Select your Roles <span className="text-red-500">*</span>
                            <span className="ml-2 text-[var(--text-muted)] font-normal text-xs">(Max 3)</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AVAILABLE_ROLES.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => toggleRole(role.id)}
                                    className={`
                                        p-3 rounded-lg border text-sm text-left transition-all
                                        ${formData.roles.includes(role.id)
                                            ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                                            : 'bg-[var(--bg-hover)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                                        }
                                    `}
                                >
                                    {role.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Day Rate Range (Optional)</label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-3 text-[var(--text-muted)] text-sm">GHS</span>
                                <input
                                    type="number"
                                    value={formData.rate_min}
                                    onChange={(e) => setFormData({ ...formData, rate_min: e.target.value })}
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-12 pr-4 focus:border-[var(--accent-primary)] outline-none"
                                    placeholder="Min"
                                />
                            </div>
                            <span className="text-[var(--text-muted)]">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-3 text-[var(--text-muted)] text-sm">GHS</span>
                                <input
                                    type="number"
                                    value={formData.rate_max}
                                    onChange={(e) => setFormData({ ...formData, rate_max: e.target.value })}
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-12 pr-4 focus:border-[var(--accent-primary)] outline-none"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">This will be shown on your profile as an indicative range.</p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Portfolio Links</label>

                        <div className="relative">
                            <Instagram className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="url"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] outline-none"
                                placeholder="Instagram Profile URL"
                            />
                        </div>

                        <div className="relative">
                            <Globe className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2.5 pl-10 pr-4 focus:border-[var(--accent-primary)] outline-none"
                                placeholder="Website / Portfolio URL"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Creating Profile...
                                </>
                            ) : (
                                <>
                                    <Check size={18} className="mr-2" />
                                    Complete Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

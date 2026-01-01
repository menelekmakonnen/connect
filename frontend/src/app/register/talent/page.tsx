'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import {
    User, MapPin, AlignLeft, ArrowRight, ArrowLeft,
    Check, Loader2, Instagram, Globe, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_ROLES = [
    { id: 'ROLE_MUA_001', name: 'Makeup Artist', color: 'var(--role-hairmakeup)' },
    { id: 'ROLE_HAIR_001', name: 'Hair Stylist', color: 'var(--role-hairmakeup)' },
    { id: 'ROLE_COSTUME_001', name: 'Costume Designer', color: 'var(--role-art)' },
    { id: 'ROLE_SET_001', name: 'Set Designer', color: 'var(--role-art)' },
    { id: 'ROLE_LIGHT_001', name: 'Gaffer / Lighting', color: 'var(--role-lighting)' },
    { id: 'ROLE_SOUND_001', name: 'Sound Mixer', color: 'var(--role-sound)' },
    { id: 'ROLE_DIR_001', name: 'Director', color: 'var(--role-production)' },
    { id: 'ROLE_DOP_001', name: 'Cinematographer', color: 'var(--role-camera)' },
];

export default function TalentEnginePage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Unified State
    const [formData, setFormData] = useState({
        display_name: user?.display_name || '',
        headline: '',
        bio: '',
        city: 'Accra',
        neighborhood: '',
        roles: [] as string[],
        rate_min: '',
        rate_max: '',
        currency: 'GHS',
        instagram: '',
        website: '',
    });

    const toggleRole = (roleId: string) => {
        if (formData.roles.includes(roleId)) {
            setFormData({ ...formData, roles: formData.roles.filter(r => r !== roleId) });
        } else {
            if (formData.roles.length >= 3) return;
            setFormData({ ...formData, roles: [...formData.roles, roleId] });
        }
    };

    const handleComplete = async () => {
        if (formData.roles.length === 0) {
            setError('Please select at least one role');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Map form data to the Talent structure defined in lib/types.ts
            const talentData = {
                display_name: formData.display_name,
                headline: formData.headline,
                bio: formData.bio,
                city: formData.city as any,
                neighborhood: formData.neighborhood,
                roles_primary: formData.roles,
                availability_status: 'available' as const,
                featured: false,
                languages: ['English', 'Twi'],
                visibility: 'private', // Turned off by default as requested
                day_rate_min: parseInt(formData.rate_min) || 0,
                day_rate_max: parseInt(formData.rate_max) || 0,
            };

            await api.talents.create(talentData as any);
            setStep(3); // Success step

        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.message || 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto py-24 px-4 text-center">
                <Card className="p-8 border-none bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-card)]">
                    <Sparkles className="w-12 h-12 mx-auto mb-6 text-[var(--accent-primary)]" />
                    <h1 className="text-2xl font-bold mb-4">Start Your Journey</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Sign in to build your professional talent profile and join the ICUNI network.
                    </p>
                    <Button
                        size="lg"
                        className="w-full bg-[var(--accent-primary)] text-black"
                        onClick={() => router.push('/login?returnUrl=/register/talent')}
                    >
                        Sign in with Google
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        <header>
                            <h1 className="text-4xl font-black mb-2 tracking-tight">THE ENGINE</h1>
                            <p className="text-[var(--text-muted)]">Step 1 of 2: Who are you in the industry?</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-8 space-y-6 bg-black/40 border-[var(--border-subtle)] backdrop-blur-xl">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Display Name</label>
                                        <input
                                            type="text"
                                            value={formData.display_name}
                                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xl font-medium focus:border-[var(--accent-primary)] outline-none transition-all"
                                            placeholder="Ama Mensah"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Headline</label>
                                        <input
                                            type="text"
                                            value={formData.headline}
                                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-lg focus:border-[var(--accent-primary)] outline-none transition-all"
                                            placeholder="Professional MUA & Special FX Artist"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 min-h-[150px] focus:border-[var(--accent-primary)] outline-none transition-all resize-none"
                                        placeholder="Experience, style, gear..."
                                    />
                                </div>
                            </Card>

                            <div className="space-y-8 flex flex-col justify-between">
                                <Card className="p-8 space-y-6 bg-black/20 border-dashed border-white/10">
                                    <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest">Base Location</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <select
                                            aria-label="City"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[var(--accent-primary)] transition-all appearance-none"
                                        >
                                            <option value="Accra">Accra</option>
                                            <option value="Kumasi">Kumasi</option>
                                            <option value="Takoradi">Takoradi</option>
                                            <option value="Tamale">Tamale</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={formData.neighborhood}
                                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[var(--accent-primary)] transition-all"
                                            placeholder="Neighborhood (e.g. Osu)"
                                        />
                                    </div>
                                </Card>

                                <Button
                                    className="h-20 text-xl font-bold rounded-2xl bg-[var(--accent-primary)] text-black"
                                    onClick={() => setStep(2)}
                                >
                                    PROCEED TO ROLES
                                    <ArrowRight className="ml-3" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">CAPABILITIES</h1>
                                <p className="text-[var(--text-muted)]">Select your primary roles & rates</p>
                            </div>
                            <Button variant="ghost" onClick={() => setStep(1)}>
                                <ArrowLeft className="mr-2" /> Back
                            </Button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Role Grid */}
                            <div className="md:col-span-8 grid grid-cols-2 gap-4">
                                {AVAILABLE_ROLES.map(role => {
                                    const isSelected = formData.roles.includes(role.id);
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => toggleRole(role.id)}
                                            style={{
                                                borderColor: isSelected ? role.color : 'transparent',
                                                backgroundColor: isSelected ? `${role.color}10` : 'transparent'
                                            }}
                                            className={`
                                                p-6 rounded-2xl border-2 text-left transition-all group relative overflow-hidden
                                                ${!isSelected ? 'bg-white/5 hover:bg-white/10 border-white/10' : ''}
                                            `}
                                        >
                                            <div className="font-bold text-lg mb-1">{role.name}</div>
                                            <div className="text-xs opacity-50 uppercase tracking-tighter">ICUNI CERTIFIED ROLE</div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <Check size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Supplementary Info */}
                            <div className="md:col-span-4 space-y-6">
                                <Card className="p-6 space-y-6 bg-black/40 border-white/10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold opacity-50 uppercase tracking-widest">Day Rate (GHS)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="MIN"
                                                value={formData.rate_min}
                                                onChange={(e) => setFormData({ ...formData, rate_min: e.target.value })}
                                                className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-4 text-center text-lg outline-none focus:border-[var(--accent-primary)]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="MAX"
                                                value={formData.rate_max}
                                                onChange={(e) => setFormData({ ...formData, rate_max: e.target.value })}
                                                className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-4 text-center text-lg outline-none focus:border-[var(--accent-primary)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold opacity-50 uppercase tracking-widest">Portfolio Links</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center bg-white/5 rounded-xl px-4 border border-white/10 focus-within:border-[var(--accent-primary)] transition-all">
                                                <Instagram size={18} className="opacity-40 mr-3" />
                                                <input
                                                    type="text"
                                                    placeholder="Instagram URL"
                                                    value={formData.instagram}
                                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                    className="bg-transparent border-none py-4 w-full outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center bg-white/5 rounded-xl px-4 border border-white/10 focus-within:border-[var(--accent-primary)] transition-all">
                                                <Globe size={18} className="opacity-40 mr-3" />
                                                <input
                                                    type="text"
                                                    placeholder="Portfolio Website"
                                                    value={formData.website}
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                    className="bg-transparent border-none py-4 w-full outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Button
                                    className="w-full h-20 text-xl font-bold bg-white text-black hover:bg-[var(--accent-primary)] transition-all"
                                    onClick={handleComplete}
                                    disabled={loading || formData.roles.length === 0}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'INITIALIZE PROFILE'}
                                </Button>
                                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md mx-auto py-24 text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(var(--accent-primary-rgb),0.4)]">
                            <Check size={48} className="text-black" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black">SYSTEM INITIALIZED</h1>
                            <p className="text-[var(--text-secondary)]">Your professional profile has been built. It is set to private by default. You can publish it anytime in your dashboard.</p>
                        </div>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full h-16 rounded-xl text-lg font-bold"
                            onClick={() => router.push('/dashboard')}
                        >
                            GO TO DASHBOARD
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

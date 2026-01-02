'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import {
    User, MapPin, AlignLeft, Check, Loader2, Instagram,
    Globe, Sparkles, ChevronDown, ChevronUp, Briefcase
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

type Section = 'profile' | 'roles' | 'rates' | 'complete';

export default function TalentRegistrationPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<Section>('profile');
    const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());

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

    const completeSection = (section: Section, nextSection?: Section) => {
        setCompletedSections(prev => new Set([...prev, section]));
        if (nextSection) {
            setExpandedSection(nextSection);
        }
    };

    const isProfileComplete = () => {
        return formData.display_name && formData.headline && formData.bio && formData.city;
    };

    const isRolesComplete = () => {
        return formData.roles.length > 0;
    };

    const isRatesComplete = () => {
        return formData.rate_min && formData.rate_max;
    };

    const handleSubmit = async () => {
        if (!isRolesComplete()) {
            setError('Please select at least one role');
            return;
        }

        setLoading(true);
        setError(null);

        try {
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
                visibility: 'private',
                day_rate_min: parseInt(formData.rate_min) || 0,
                day_rate_max: parseInt(formData.rate_max) || 0,
            };

            await api.talents.create(talentData as any);
            completeSection('complete');
            setExpandedSection('complete');

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

    const SectionHeader = ({
        section,
        title,
        description,
        icon: Icon
    }: {
        section: Section;
        title: string;
        description: string;
        icon: any
    }) => {
        const isComplete = completedSections.has(section);
        const isExpanded = expandedSection === section;
        const canExpand = section === 'profile' || completedSections.has(getPreviousSection(section)!);

        return (
            <button
                onClick={() => canExpand && setExpandedSection(isExpanded ? ('profile' as Section) : section)}
                disabled={!canExpand}
                className={`
                    w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all
                    ${isExpanded ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]' :
                        isComplete ? 'bg-white/5 border-white/20' :
                            'bg-white/5 border-white/10 opacity-50'}
                    ${canExpand ? 'hover:bg-white/10 cursor-pointer' : 'cursor-not-allowed'}
                `}
            >
                <div className="flex items-center gap-4">
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isComplete ? 'bg-green-500' : isExpanded ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}
                    `}>
                        {isComplete ? <Check size={24} className="text-black" /> : <Icon size={24} />}
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-sm text-[var(--text-muted)]">{description}</p>
                    </div>
                </div>
                {canExpand && (isExpanded ? <ChevronUp /> : <ChevronDown />)}
            </button>
        );
    };

    const getPreviousSection = (section: Section): Section | null => {
        const sections: Section[] = ['profile', 'roles', 'rates', 'complete'];
        const index = sections.indexOf(section);
        return index > 0 ? sections[index - 1] : null;
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-black mb-3 tracking-tight">Talent Registration</h1>
                <p className="text-xl text-[var(--text-muted)]">
                    Build your professional profile in a few simple steps
                </p>
            </header>

            <div className="space-y-4">
                {/* Profile Section */}
                <div>
                    <SectionHeader
                        section="profile"
                        title="1. Profile Information"
                        description="Tell us about yourself"
                        icon={User}
                    />
                    <AnimatePresence>
                        {expandedSection === 'profile' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <Card className="mt-4 p-8 bg-black/40 border-[var(--border-subtle)]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Display Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.display_name}
                                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-lg focus:border-[var(--accent-primary)] outline-none transition-all"
                                                placeholder="Ama Mensah"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Headline *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.headline}
                                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-lg focus:border-[var(--accent-primary)] outline-none transition-all"
                                                placeholder="Professional MUA & Special FX Artist"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Bio *
                                            </label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 min-h-[120px] focus:border-[var(--accent-primary)] outline-none transition-all resize-none"
                                                placeholder="Tell us about your experience, style, and what makes you unique..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                City *
                                            </label>
                                            <select
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[var(--accent-primary)] transition-all"
                                            >
                                                <option value="Accra">Accra</option>
                                                <option value="Kumasi">Kumasi</option>
                                                <option value="Takoradi">Takoradi</option>
                                                <option value="Tamale">Tamale</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Neighborhood
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[var(--accent-primary)] transition-all"
                                                placeholder="e.g., Osu, Cantonments"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="mt-8 w-full md:w-auto bg-[var(--accent-primary)] text-black font-bold"
                                        onClick={() => isProfileComplete() && completeSection('profile', 'roles')}
                                        disabled={!isProfileComplete()}
                                    >
                                        Continue to Roles
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Roles Section */}
                <div>
                    <SectionHeader
                        section="roles"
                        title="2. Professional Roles"
                        description="Select your primary capabilities (up to 3)"
                        icon={Briefcase}
                    />
                    <AnimatePresence>
                        {expandedSection === 'roles' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <Card className="mt-4 p-8 bg-black/40 border-[var(--border-subtle)]">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                                        p-4 rounded-xl border-2 text-left transition-all relative
                                                        ${!isSelected ? 'bg-white/5 hover:bg-white/10 border-white/10' : ''}
                                                    `}
                                                >
                                                    <div className="font-bold text-sm mb-1">{role.name}</div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <Check size={16} />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 text-sm text-[var(--text-muted)] text-center">
                                        Selected: {formData.roles.length} / 3
                                    </div>
                                    {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
                                    <Button
                                        className="mt-6 w-full md:w-auto bg-[var(--accent-primary)] text-black font-bold"
                                        onClick={() => isRolesComplete() && completeSection('roles', 'rates')}
                                        disabled={!isRolesComplete()}
                                    >
                                        Continue to Rates
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Rates Section */}
                <div>
                    <SectionHeader
                        section="rates"
                        title="3. Day Rates & Portfolio"
                        description="Set your pricing and add portfolio links"
                        icon={MapPin}
                    />
                    <AnimatePresence>
                        {expandedSection === 'rates' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <Card className="mt-4 p-8 bg-black/40 border-[var(--border-subtle)]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Day Rate Range (GHS) *
                                            </label>
                                            <div className="flex gap-3">
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
                                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                Portfolio Links
                                            </label>
                                            <div className="space-y-2">
                                                <div className="flex items-center bg-white/5 rounded-xl px-4 border border-white/10 focus-within:border-[var(--accent-primary)]">
                                                    <Instagram size={18} className="opacity-40 mr-3" />
                                                    <input
                                                        type="text"
                                                        placeholder="Instagram URL"
                                                        value={formData.instagram}
                                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                        className="bg-transparent border-none py-4 w-full outline-none"
                                                    />
                                                </div>
                                                <div className="flex items-center bg-white/5 rounded-xl px-4 border border-white/10 focus-within:border-[var(--accent-primary)]">
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
                                    </div>
                                    <Button
                                        className="mt-8 w-full bg-white text-black hover:bg-[var(--accent-primary)] font-bold h-14 text-lg"
                                        onClick={handleSubmit}
                                        disabled={loading || !isRatesComplete()}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Success Section */}
                <AnimatePresence>
                    {expandedSection === 'complete' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-12"
                        >
                            <Card className="p-12 text-center bg-gradient-to-b from-green-500/10 to-transparent border-green-500/30">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check size={48} className="text-black" />
                                </div>
                                <h2 className="text-4xl font-black mb-4">Registration Complete!</h2>
                                <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                                    Your professional profile has been created and is set to private by default.
                                    You can publish it anytime from your dashboard.
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-[var(--accent-primary)] text-black font-bold h-16 px-12"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Go to Dashboard
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

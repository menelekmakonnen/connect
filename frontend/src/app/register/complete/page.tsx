'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select, Switch } from '@/components/ui';
import { useAuth, useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';
import {
    User,
    Briefcase,
    Building,
    ArrowRight,
    Loader2,
    MapPin,
    Globe,
    DollarSign,
    CheckCircle,
    Star
} from 'lucide-react';

export default function CompleteRegistration() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { setAuth } = useAuthStore();

    // Form States
    const [isLoading, setIsLoading] = useState(false);
    const [isTalent, setIsTalent] = useState(false);

    const [formData, setFormData] = useState({
        // Core (Producer)
        display_name: '',
        job_title: '',
        company: '',

        // Talent Specific
        primary_role: '',
        city: 'Accra',
        rate_min: '',
        rate_max: '',
        rate_currency: 'GHS'
    });

    // Pre-fill from Auth
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                display_name: user.display_name || ''
            }));
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        // Fallback if accessed directly without auth
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-slate-400 mb-6">Please sign in to complete your profile.</p>
                    <Button onClick={() => router.push('/login?returnUrl=/register/complete')}>
                        Sign In
                    </Button>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // In a real app, we would send this to the API
            // const response = await api.auth.completeProfile({
            //     ...formData,
            //     account_type: isTalent ? 'talent' : 'pm'
            // });

            // Mocking success
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] py-12 px-4 flex justify-center">
            <div className="w-full max-w-3xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Complete Your Profile
                    </h1>
                    <p className="text-slate-400">
                        Customize your workspace. You can change these settings anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left: Interactive Preview Card */}
                    <div className="md:col-span-1 hidden md:block">
                        <div className="sticky top-12">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">ID Preview</h3>

                            <div className="bg-[#1a1d29] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
                                <div className="h-24 bg-gradient-to-br from-purple-600/20 to-cyan-600/20" />
                                <div className="px-6 pb-6 relative">
                                    <div className="w-16 h-16 rounded-2xl bg-[#0f1117] border-4 border-[#1a1d29] absolute -top-8 flex items-center justify-center text-xl font-bold text-slate-300 shadow-lg">
                                        {formData.display_name.charAt(0) || 'U'}
                                    </div>
                                    <div className="mt-10">
                                        <h4 className="font-bold text-white text-lg leading-tight truncate">
                                            {formData.display_name || 'Your Name'}
                                        </h4>
                                        <p className="text-sm text-slate-400 truncate">
                                            {formData.job_title || 'Producer'}
                                        </p>

                                        {isTalent && (
                                            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Star size={12} className="text-yellow-500" />
                                                    <span>Available for work</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <MapPin size={12} />
                                                    <span>{formData.city}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The Form */}
                    <div className="md:col-span-2">
                        <Card className="p-8 border-white/10 bg-[#1a1d29]/50 backdrop-blur-xl">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Section 1: Core Identity */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                            <User size={16} />
                                        </div>
                                        <h3 className="font-bold text-white">Identity</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Full Name</label>
                                            <Input
                                                value={formData.display_name}
                                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                                placeholder="e.g. Ama K. Abebrese"
                                                className="bg-[#0f1117] border-white/10"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Job Title</label>
                                                <Input
                                                    value={formData.job_title}
                                                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                                    placeholder="Producer"
                                                    className="bg-[#0f1117] border-white/10"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Company (Optional)</label>
                                                <Input
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    placeholder="Studio Name"
                                                    className="bg-[#0f1117] border-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                {/* Section 2: Talent Toggle */}
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-transparent border border-white/5">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                <Switch
                                                    id="talent-mode"
                                                    checked={isTalent}
                                                    onCheckedChange={setIsTalent}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="talent-mode" className="font-bold text-white cursor-pointer select-none">
                                                    Available for Work
                                                </label>
                                                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                                                    Toggle this on to create a public talent profile. You'll be searchable by other producers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional Talent Fields */}
                                    {isTalent && (
                                        <div className="space-y-4 pl-4 border-l-2 border-purple-500/20 animate-in fade-in slide-in-from-left-4 duration-300">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">Primary Role</label>
                                                    <Select
                                                        value={formData.primary_role}
                                                        onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
                                                        className="bg-[#0f1117] border-white/10"
                                                    >
                                                        <option value="">Select Role...</option>
                                                        <option value="director">Director</option>
                                                        <option value="producer">Producer</option>
                                                        <option value="dp">Director of Photography</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="sound">Sound Engineer</option>
                                                        <option value="gaffer">Gaffer</option>
                                                        <option value="makeup">Makeup Artist</option>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">Base City</label>
                                                    <Select
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="bg-[#0f1117] border-white/10"
                                                    >
                                                        <option value="Accra">Accra</option>
                                                        <option value="Kumasi">Kumasi</option>
                                                        <option value="Tema">Tema</option>
                                                        <option value="Takoradi">Takoradi</option>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Day Rate Range (GHS)</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={formData.rate_min}
                                                        onChange={(e) => setFormData({ ...formData, rate_min: e.target.value })}
                                                        className="bg-[#0f1117] border-white/10"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={formData.rate_max}
                                                        onChange={(e) => setFormData({ ...formData, rate_max: e.target.value })}
                                                        className="bg-[#0f1117] border-white/10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full btn-gradient py-6 text-lg font-bold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

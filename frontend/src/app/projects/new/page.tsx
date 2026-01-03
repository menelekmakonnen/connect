'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select } from '@/components/ui';
import type { ProjectType, BudgetTier } from '@/lib/types';
import { api } from '@/lib/api';
import { ArrowLeft, ArrowRight, Calendar, MapPin, DollarSign, Globe, Lock, Loader2, Target, Sparkles, Zap, Layers } from 'lucide-react';
import Link from 'next/link';

const projectTypes = [
    { value: 'music_video', label: 'Music Video', icon: <Zap size={18} /> },
    { value: 'brand_shoot', label: 'Brand Shoot', icon: <Target size={18} /> },
    { value: 'short_film', label: 'Short Film', icon: <Layers size={18} /> },
    { value: 'doc', label: 'Documentary', icon: <Globe size={18} /> },
    { value: 'event', label: 'Event', icon: <Sparkles size={18} /> },
    { value: 'other', label: 'Other', icon: <Plus size={18} /> },
];

const budgetTiers = [
    { value: 'low', label: 'Budget-Friendly', description: 'Entry-level rates, newer talent' },
    { value: 'mid', label: 'Mid-Range', description: 'Experienced talent, standard rates' },
    { value: 'premium', label: 'Premium', description: 'Top-tier talent, industry rates' },
];

const cityOptions = [
    { value: 'Accra', label: 'Accra' },
    { value: 'Kumasi', label: 'Kumasi' },
    { value: 'Tema', label: 'Tema' },
    { value: 'Takoradi', label: 'Takoradi' },
    { value: 'Other', label: 'Other' },
];

export default function NewProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        type: '' as ProjectType | '',
        start_date: '',
        end_date: '',
        location_city: '',
        location_notes: '',
        brief: '',
        budget_tier: '' as BudgetTier | '',
        client_name: '',
        visibility: 'public',
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [loading_create, setLoadingCreate] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoadingCreate(true);
            const res = await api.projects.create(formData);
            router.push(`/projects/${res.project_id}`);
        } catch (err) {
            console.error('Failed to create project:', err);
        } finally {
            setLoadingCreate(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return formData.title && formData.type;
        if (step === 2) return formData.start_date && formData.location_city;
        if (step === 3) return formData.budget_tier;
        return true;
    };

    return (
        <div className="animate-fade-in max-w-3xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="mb-12 text-center">
                <Link href="/projects" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 mb-8 transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Explorer
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Initialize Production</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Phase {step} of 3: {step === 1 ? 'Project Definition' : step === 2 ? 'Logistics & Origin' : 'Financials & Brief'}
                </p>
            </div>

            {/* Premium Progress Controller */}
            <div className="flex items-center justify-between mb-12 px-10 relative">
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-10 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-700"
                    style={{ width: `${((step - 1) / 2) * (100 - (100 / 3))}%` }}
                />

                {[1, 2, 3].map((s) => (
                    <div key={s} className="relative z-10">
                        <div
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 border-2",
                                s === step
                                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_var(--purple-600)] scale-110'
                                    : s < step
                                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_var(--cyan-500)]'
                                        : 'bg-[#1a1d29] border-white/10 text-slate-600'
                            )}
                        >
                            {s < step ? '✓' : s}
                        </div>
                    </div>
                ))}
            </div>

            {/* Step 1: Basics */}
            {step === 1 && (
                <Card className="p-10 bg-[#1e2130] border-white/5 rounded-[40px] shadow-2xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                        <Target size={22} className="text-purple-400" />
                        Production Definition
                    </h2>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Identifier</label>
                            <Input
                                placeholder="e.g. Sarkodie 'Landmark' Shoot 2024"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="h-16 bg-black/40 border-white/10 rounded-2xl text-lg font-bold placeholder:text-slate-800"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Core Category</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {projectTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => updateField('type', type.value as ProjectType)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-3 p-6 rounded-[28px] border-2 transition-all group",
                                            formData.type === type.value
                                                ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]'
                                                : 'bg-black/20 border-white/5 hover:border-white/10'
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            formData.type === type.value ? "bg-purple-600 text-white" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                                        )}>
                                            {type.icon}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            formData.type === type.value ? "text-purple-400" : "text-slate-500"
                                        )}>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Client Entity (Optional)</label>
                            <Input
                                placeholder="e.g. Universal Music Group"
                                value={formData.client_name}
                                onChange={(e) => updateField('client_name', e.target.value)}
                                className="h-16 bg-black/40 border-white/10 rounded-2xl text-lg font-bold placeholder:text-slate-800"
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 2: Schedule & Logistics */}
            {step === 2 && (
                <Card className="p-10 bg-[#1e2130] border-white/5 rounded-[40px] shadow-2xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                        <MapPin size={22} className="text-cyan-400" />
                        Logistics & timeline
                    </h2>

                    <div className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kick-off Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                                    <Input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => updateField('start_date', e.target.value)}
                                        className="h-16 pl-14 bg-black/40 border-white/10 rounded-2xl font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Wrap (Optional)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                                    <Input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => updateField('end_date', e.target.value)}
                                        className="h-16 pl-14 bg-black/40 border-white/10 rounded-2xl font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Production Hub</label>
                            <Select
                                options={[{ value: '', label: 'Select region...' }, ...cityOptions]}
                                value={formData.location_city}
                                onChange={(e) => updateField('location_city', e.target.value)}
                                className="h-16 bg-black/40 border-white/10 rounded-2xl font-bold appearance-none px-6"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location Dossier</label>
                            <Input
                                placeholder="e.g. Studio 5, Labadi Beach, Multiple Locations..."
                                value={formData.location_notes}
                                onChange={(e) => updateField('location_notes', e.target.value)}
                                className="h-16 bg-black/40 border-white/10 rounded-2xl font-bold placeholder:text-slate-800"
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 3: Financials & Brief */}
            {step === 3 && (
                <Card className="p-10 bg-[#1e2130] border-white/5 rounded-[40px] shadow-2xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                        <DollarSign size={22} className="text-purple-400" />
                        Commercial Deck
                    </h2>

                    <div className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Budget Allocation</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {budgetTiers.map((tier) => (
                                    <button
                                        key={tier.value}
                                        onClick={() => updateField('budget_tier', tier.value as BudgetTier)}
                                        className={cn(
                                            "p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group",
                                            formData.budget_tier === tier.value
                                                ? 'bg-purple-600/10 border-purple-500 ring-1 ring-purple-500/50 shadow-xl'
                                                : 'bg-black/20 border-white/5 hover:border-white/10'
                                        )}
                                    >
                                        <div className="relative z-10">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest mb-1 block",
                                                formData.budget_tier === tier.value ? "text-purple-400" : "text-slate-500"
                                            )}>{tier.label}</span>
                                            <span className="text-xs text-slate-600 font-medium leading-tight block">{tier.description}</span>
                                        </div>
                                        {formData.budget_tier === tier.value && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Creative Brief</label>
                            <textarea
                                className="w-full min-h-[160px] bg-black/40 border border-white/10 rounded-3xl p-6 text-white text-lg font-medium outline-none focus:border-purple-500 transition-all resize-none shadow-inner placeholder:text-slate-800"
                                placeholder="Elaborate on the vision, set requirements, and aesthetic direction..."
                                value={formData.brief}
                                onChange={(e) => updateField('brief', e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Engine Visibility</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => updateField('visibility', 'public')}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 text-left transition-all group",
                                        formData.visibility === 'public'
                                            ? 'bg-purple-600/10 border-purple-500'
                                            : 'bg-black/20 border-white/5'
                                    )}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                            formData.visibility === 'public' ? "bg-purple-600 text-white" : "bg-white/5 text-slate-500"
                                        )}>
                                            <Globe size={18} />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest",
                                            formData.visibility === 'public' ? "text-white" : "text-slate-500"
                                        )}>Public Network</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">Broadcast to the marketplace for applicants.</p>
                                </button>

                                <button
                                    onClick={() => updateField('visibility', 'private')}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 text-left transition-all group",
                                        formData.visibility === 'private'
                                            ? 'bg-purple-600/10 border-purple-500'
                                            : 'bg-black/20 border-white/5'
                                    )}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                            formData.visibility === 'private' ? "bg-purple-600 text-white" : "bg-white/5 text-slate-500"
                                        )}>
                                            <Lock size={18} />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest",
                                            formData.visibility === 'private' ? "text-white" : "text-slate-500"
                                        )}>Private Channel</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">Elite invites only. Hidden from the public roster.</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Navigation Controller */}
            <div className="flex items-center justify-between mt-12 px-2">
                {step > 1 ? (
                    <Button
                        variant="secondary"
                        onClick={() => setStep(step - 1)}
                        className="h-16 px-10 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] gap-3"
                    >
                        <ArrowLeft size={18} />
                        Stage Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < 3 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="h-16 px-12 rounded-3xl btn-gradient border-none font-black uppercase tracking-widest text-[10px] gap-3 shadow-lg shadow-purple-900/20"
                    >
                        Advance Phase
                        <ArrowRight size={18} />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={!canProceed() || loading_create}
                        className="h-16 px-12 rounded-3xl btn-gradient border-none font-black uppercase tracking-widest text-[10px] gap-3 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                    >
                        {loading_create ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                        Engine Start
                    </Button>
                )}
            </div>
        </div >
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { Button, Card } from '@/components/ui';
import {
    Calendar,
    Coins,
    Trash2,
    Save,
    LayoutGrid,
    Users,
    Clock,
    Loader2,
    Globe,
    Lock,
    Sparkles,
    Target,
    Zap,
    UsersRound // Added for privacy toggle icon
} from 'lucide-react';
import { ProductionGantt, DEFAULT_PHASES } from '@/components/projects/ProductionGantt';

import { api } from '@/lib/api';
import { Project, ProjectSummary } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const PROJECT_TYPES = [
    'Feature Film', 'Short Film', 'Commercial', 'Music Video', 'Documentary', 'Corporate', 'Event', 'Photoshoot', 'Other'
];

const CURRENCIES = ['GHS', 'USD', 'EUR', 'GBP', 'NGN'];

export function ProjectManager({ initialData }: { initialData?: Project | ProjectSummary }) {
    const { draft, updateDraft, updateScheduleItem, removeFromProject, clearDraft, setDraft } = useAppStore();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Initialize from prop if provided
    useEffect(() => {
        if (initialData) {
            setDraft({
                name: initialData.title,
                type: initialData.type,
                budget: (initialData as any).budget || 50000,
                visibility: (initialData as any).visibility || (initialData as any).public_private || 'public',
                selectedTalents: [],
            } as any);
        }
    }, [initialData, setDraft]);

    // Calculated fields
    const totalDuration = draft.schedule.reduce((acc, item) => item.enabled ? acc + item.durationWeeks : 0, 0);
    const endDate = draft.startDate ? new Date(new Date(draft.startDate).getTime() + totalDuration * 7 * 24 * 60 * 60 * 1000) : null;

    const handleSave = async () => {
        if (!isAuthenticated) return;
        setIsSaving(true);
        try {
            const projectData = {
                title: draft.name,
                type: draft.type || 'other',
                budget_tier: draft.budget > 50000 ? 'high' : 'mid',
                start_date: draft.startDate || '',
                visibility: draft.visibility,
            };

            if (initialData && initialData.project_id) {
                await api.projects.update(initialData.project_id, projectData);
            } else {
                await api.projects.create(projectData);
            }

            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in group/main">
            {/* Project Title Area */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
                <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold uppercase tracking-[0.15em]">
                            <Target size={12} />
                            Project Scope
                        </div>
                        {draft.selectedTalents.length > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-[0.15em]">
                                <Users size={12} />
                                {draft.selectedTalents.length} Staffed
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => updateDraft({ name: e.target.value })}
                        placeholder="Project Name..."
                        className="text-5xl font-black bg-transparent border-none outline-none placeholder:text-slate-800 text-white w-full tracking-tight focus:ring-0"
                    />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        variant="secondary"
                        onClick={clearDraft}
                        className="h-14 w-14 p-0 rounded-2xl bg-white/5 border-white/10 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border group/clear"
                    >
                        <Trash2 size={24} className="group-hover/clear:scale-110 transition-transform" />
                    </Button>

                    <Button
                        className="h-14 px-8 rounded-2xl btn-gradient border-none group/save font-bold text-lg"
                        onClick={handleSave}
                        disabled={isSaving || !draft.name}
                    >
                        {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} className="transition-transform group-hover/save:scale-110" />}
                        <span className="ml-3">{initialData ? 'Update Pipeline' : 'Launch Project'}</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Core Config */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-10 bg-[#1e2130] border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                            <LayoutGrid size={22} className="text-purple-400" />
                            Production Setup
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                <select
                                    value={draft.type}
                                    onChange={(e) => updateDraft({ type: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all cursor-pointer appearance-none shadow-inner"
                                >
                                    <option value="">Select Category...</option>
                                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Control</label>
                                <div className="space-y-2">
                                    <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1.5 shadow-inner">
                                        <button
                                            onClick={() => updateDraft({ visibility: 'public' })}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all",
                                                draft.visibility === 'public'
                                                    ? "bg-purple-600 text-white shadow-lg"
                                                    : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            <Globe size={16} />
                                            Public
                                        </button>
                                        <button
                                            onClick={() => updateDraft({ visibility: 'private' })}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all",
                                                draft.visibility === 'private'
                                                    ? "bg-purple-600 text-white shadow-lg"
                                                    : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            <Lock size={16} />
                                            Private
                                        </button>
                                    </div>

                                    {/* Reveal Crew Toggle */}
                                    <div
                                        onClick={() => updateDraft({ revealTeam: !draft.revealTeam })}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all",
                                            draft.revealTeam
                                                ? "bg-cyan-500/10 border-cyan-500/30"
                                                : "bg-black/20 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                draft.revealTeam ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-500"
                                            )}>
                                                <UsersRound size={16} />
                                            </div>
                                            <div>
                                                <div className={cn("text-xs font-bold", draft.revealTeam ? "text-cyan-400" : "text-slate-400")}>Open Roster</div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-6 rounded-full p-1 transition-all relative",
                                            draft.revealTeam ? "bg-cyan-500" : "bg-slate-700"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white shadow-sm transition-all absolute top-1",
                                                draft.revealTeam ? "left-5" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-10">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Production Brief</label>
                            <textarea
                                value={draft.brief}
                                onChange={(e) => updateDraft({ brief: e.target.value })}
                                placeholder="Describe your vision, requirements, and shoot goals..."
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500 transition-all resize-none shadow-inner placeholder:text-slate-700"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Budget Section */}
                            <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment Deck</label>
                                    <select
                                        value={draft.currency}
                                        onChange={(e) => updateDraft({ currency: e.target.value as any })}
                                        className="bg-purple-500/10 text-[10px] font-bold text-purple-400 outline-none border border-purple-500/20 px-2 py-1 rounded"
                                    >
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="text-4xl font-black text-white tracking-tighter">
                                    {formatCurrency(draft.budget, draft.currency)}
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    step="1000"
                                    value={draft.budget}
                                    onChange={(e) => updateDraft({ budget: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-black/60 rounded-full appearance-none accent-purple-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                                    <span>Indie</span>
                                    <span>Professional</span>
                                    <span>Premium</span>
                                </div>
                            </div>

                            {/* Scale/Ambition Section */}
                            <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                    Ambition Level
                                    <span className="text-purple-400 font-bold tracking-normal">{draft.ambition}/10</span>
                                </label>
                                <div className="text-sm font-bold text-white h-10 flex items-center">
                                    {draft.ambition < 4 ? <span className="flex items-center gap-2"><Sparkles size={16} className="text-yellow-500" /> Indie Spirit</span> :
                                        draft.ambition < 8 ? <span className="flex items-center gap-2"><Zap size={16} className="text-cyan-500" /> Commercial Grade</span> :
                                            <span className="flex items-center gap-2 animate-pulse"><Zap size={16} className="text-purple-500" /> Blockbuster Vision</span>}
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={draft.ambition}
                                    onChange={(e) => updateDraft({ ambition: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-black/60 rounded-full appearance-none accent-purple-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                                    <span>Scale 1</span>
                                    <span>Scale 10</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline Config */}
                    <Card className="p-10 bg-[#1e2130] border-white/5 rounded-[32px] shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                            <Clock size={22} className="text-purple-400" />
                            Production Pipeline
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 border-b border-white/5 pb-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="date"
                                        value={draft.startDate ? draft.startDate.split('T')[0] : ''}
                                        onChange={(e) => updateDraft({ startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-purple-500 transition-all cursor-pointer shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Wrapped & Delivered</label>
                                <div className="bg-black/40 border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between shadow-inner">
                                    <span className="text-lg font-bold text-white">
                                        {endDate ? endDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending Start'}
                                    </span>
                                    <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2.5 py-1.5 rounded-lg border border-purple-500/20">
                                        {totalDuration} WEEKS
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <ProductionGantt
                                totalDuration={120} // Default view range
                                phases={draft.schedule.map((item, idx) => ({
                                    id: item.phase.toLowerCase().replace(' ', '-'),
                                    name: item.phase,
                                    // Use stored startDay or a default staggered start if not set
                                    startDay: item.startDay ?? (idx * 14),
                                    duration: item.durationWeeks * 7,
                                    color: idx === 0 ? '#a855f7' : idx === 1 ? '#3b82f6' : idx === 2 ? '#ef4444' : '#22c55e'
                                }))}
                                className="w-full"
                                onPhasesChange={(updatedPhases) => {
                                    // Map Gantt phase updates back to schedule items
                                    const newSchedule = [...draft.schedule];
                                    updatedPhases.forEach((p) => {
                                        const idx = newSchedule.findIndex(s => s.phase === p.name);
                                        if (idx !== -1) {
                                            newSchedule[idx] = {
                                                ...newSchedule[idx],
                                                startDay: p.startDay,
                                                durationWeeks: Math.round(p.duration / 7)
                                            };
                                        }
                                    });
                                    updateDraft({ schedule: newSchedule });
                                }}
                            />
                        </div>
                    </Card>
                </div>

                {/* Staffing Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="bg-[#1e2130] border-white/5 rounded-[32px] p-8 flex flex-col min-h-[500px] shadow-2xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[50px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <h3 className="text-xl font-bold text-white mb-8 flex items-center justify-between relative z-10">
                                <span className="flex items-center gap-3">
                                    <Users size={22} className="text-cyan-400" />
                                    Elite Crew
                                </span>
                                <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full">
                                    {draft.selectedTalents.length} SLOTS
                                </span>
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar relative z-10">
                                {draft.selectedTalents.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl bg-black/10 transition-colors hover:border-white/10">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                                            <Users size={32} className="text-slate-600" />
                                        </div>
                                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed">No talent <br />shortlisted yet.</p>
                                        <Button
                                            className="mt-8 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10"
                                            onClick={() => router.push('/talents')}
                                        >
                                            Explore Roster
                                        </Button>
                                    </div>
                                ) : (
                                    draft.selectedTalents.map((talent) => (
                                        <div key={talent.talent_id} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group/talent cursor-default">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0 group-hover/talent:scale-105 transition-transform">
                                                {talent.profile_photo_url ? (
                                                    <img src={talent.profile_photo_url} alt={talent.display_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-lg font-black text-slate-500">{talent.display_name.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white text-sm truncate group-hover/talent:text-cyan-400 transition-colors uppercase tracking-tight">{talent.display_name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{talent.roles?.[0]?.role_name || 'Creative'}</div>
                                            </div>
                                            <button
                                                onClick={() => removeFromProject(talent.talent_id)}
                                                className="text-slate-700 hover:text-red-500 p-2 opacity-0 group-hover/talent:opacity-100 transition-all hover:bg-red-500/10 rounded-xl"
                                                title="Remove Talent"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                                <div className="flex justify-between items-center px-2">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Est. Crew Commitment</div>
                                        <div className="text-xl font-black text-white tracking-tight">
                                            ~{formatCurrency(draft.selectedTalents.length * 1500, draft.currency)}
                                        </div>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                        <Coins size={20} className="text-cyan-400" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

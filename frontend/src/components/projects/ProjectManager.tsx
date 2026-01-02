'use client';

import { useState, useEffect } from 'react';
import { useAppStore, ScheduleItem } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { Button, Input, Card } from '@/components/ui';
import {
    Calendar,
    Coins,
    Trash2,
    Send,
    Save,
    Info,
    ChevronDown,
    ChevronUp,
    LayoutGrid,
    Users,
    Clock,
    Check,
    Loader2,
    Globe,
    Lock
} from 'lucide-react';
import { api } from '@/lib/api';
import { Project, ProjectSummary } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const PROJECT_TYPES = [
    'Feature Film', 'Short Film', 'Commercial', 'Music Video', 'Documentary', 'Corporate', 'Event', 'Photoshoot', 'Other'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN'];

export function ProjectManager({ initialData }: { initialData?: Project | ProjectSummary }) {
    const { draft, updateDraft, updateScheduleItem, removeFromProject, clearDraft, setDraft } = useAppStore();
    const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'talents'>('details');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    // Initialize from prop if provided
    useEffect(() => {
        if (initialData) {
            setDraft({
                name: initialData.title,
                type: initialData.type,
                // Map other fields as best as possible
                budget: (initialData as any).budget || 50000, // Fallback if budget isn't in ProjectSummary
                visibility: (initialData as any).visibility || (initialData as any).public_private || 'public',
                selectedTalents: [], // We'd need to fetch these if editing an existing project full w/ slots
                // ... map other fields
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
                budget_tier: draft.budget > 50000 ? 'high' : 'mid', // Approximate mapping
                start_date: draft.startDate || '',
                visibility: draft.visibility,
                // ... map other fields
            };

            if (initialData && initialData.project_id) {
                await api.projects.update(initialData.project_id, projectData);
            } else {
                await api.projects.create(projectData);
            }

            // alert('Project saved!');
            router.refresh();
        } catch (e) {
            console.error(e);
            alert('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendRequest = () => {
        // Implementation for sending requests (e.g. open a modal or redirect)
        // For now just alert
        alert("This feature would send requests to the selected talents.");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header / Project Name */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full">
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => updateDraft({ name: e.target.value })}
                        placeholder="Untitled Project"
                        className="text-4xl font-bold bg-transparent border-none outline-none placeholder:text-[var(--text-muted)] w-full"
                    />
                    <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                            {draft.type || 'Select Type'}
                            {draft.subType && ` • ${draft.subType}`}
                        </span>
                        <span>•</span>
                        <span>{draft.selectedTalents.length} Talents Selected</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={clearDraft} title="Clear Draft">
                        <Trash2 size={16} />
                    </Button>

                    {isAuthenticated ? (
                        <Button onClick={handleSave} disabled={isSaving || !draft.name}>
                            {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                            {initialData ? 'Save Changes' : 'Save Project'}
                        </Button>
                    ) : (
                        <Button onClick={handleSendRequest} disabled={draft.selectedTalents.length === 0}>
                            <Send size={16} className="mr-2" />
                            Send Requests
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Form & Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <LayoutGrid size={18} />
                            Project Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={draft.type}
                                    onChange={(e) => updateDraft({ type: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-2.5 outline-none focus:border-[var(--accent-primary)]"
                                >
                                    <option value="">Select Type...</option>
                                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visibility</label>
                                <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-1">
                                    <button
                                        onClick={() => updateDraft({ visibility: 'public' })}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-all",
                                            draft.visibility === 'public'
                                                ? "bg-[var(--accent-primary)] text-black"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <Globe size={14} />
                                        Public
                                    </button>
                                    <button
                                        onClick={() => updateDraft({ visibility: 'private' })}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-all",
                                            draft.visibility === 'private'
                                                ? "bg-[var(--accent-primary)] text-black"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <Lock size={14} />
                                        Private
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Genre/Style</label>
                                <Input
                                    value={draft.genre}
                                    onChange={(e) => updateDraft({ genre: e.target.value })}
                                    placeholder="e.g. Sci-Fi, Minimalist, Upbeat"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <label className="text-sm font-medium">Brief / Logline</label>
                            <textarea
                                value={draft.brief}
                                onChange={(e) => updateDraft({ brief: e.target.value })}
                                placeholder="What is this project about?"
                                rows={3}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-3 outline-none focus:border-[var(--accent-primary)] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Budget Slider */}
                            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Coins size={14} /> Budget Est.
                                    </label>
                                    <select
                                        value={draft.currency}
                                        onChange={(e) => updateDraft({ currency: e.target.value as any })}
                                        className="bg-transparent text-xs font-bold outline-none"
                                    >
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="text-2xl font-bold text-[var(--accent-primary)]">
                                    {formatCurrency(draft.budget, draft.currency)}
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="1000"
                                    value={draft.budget}
                                    onChange={(e) => updateDraft({ budget: parseInt(e.target.value) })}
                                    className="w-full accent-[var(--accent-primary)]"
                                />
                            </div>

                            {/* Ambition Slider */}
                            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-3">
                                <label className="text-sm font-medium flex justify-between">
                                    Ambition Level
                                    <span className="text-[var(--accent-primary)] font-bold">{draft.ambition}/10</span>
                                </label>
                                <div className="text-xs text-[var(--text-muted)] h-8">
                                    {draft.ambition < 4 ? "Low budget / Indie feel" :
                                        draft.ambition < 8 ? "Professional / High value" :
                                            "Blockbuster / World Class"}
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={draft.ambition}
                                    onChange={(e) => updateDraft({ ambition: parseInt(e.target.value) })}
                                    className="w-full accent-[var(--accent-primary)]"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Interactive Scheduler */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Clock size={18} />
                            Production Timeline
                        </h3>

                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Start Date</label>
                                <input
                                    type="date"
                                    value={draft.startDate ? draft.startDate.split('T')[0] : ''}
                                    onChange={(e) => updateDraft({ startDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                    className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-2 text-sm outline-none focus:border-[var(--accent-primary)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Est. Completion</label>
                                <div className="p-2 text-sm font-bold text-[var(--text-primary)]">
                                    {endDate ? endDate.toLocaleDateString() : 'Set start date'} ({totalDuration} weeks)
                                </div>
                            </div>
                        </div>

                        {/* Timeline Visual */}
                        <div className="space-y-6">
                            {draft.schedule.map((item, idx) => (
                                <div key={item.phase} className={cn("relative transition-opacity", !item.enabled && "opacity-50 grayscale")}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={item.enabled}
                                                onChange={(e) => updateScheduleItem(idx, { enabled: e.target.checked })}
                                                className="w-4 h-4 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)]"
                                            />
                                            <span className="font-medium text-sm">{item.phase}</span>
                                        </div>
                                        <span className="text-xs font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">
                                            {item.durationWeeks} weeks
                                        </span>
                                    </div>
                                    {/* Bar Slider */}
                                    <div className="relative h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden group">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-[var(--accent-primary)] rounded-full transition-all"
                                            style={{ width: `${(item.durationWeeks / 20) * 100}%`, minWidth: '4px' }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        step="1"
                                        value={item.durationWeeks}
                                        onChange={(e) => updateScheduleItem(idx, { durationWeeks: parseInt(e.target.value) })}
                                        disabled={!item.enabled}
                                        className="absolute inset-0 w-full opacity-0 cursor-ew-resize"
                                        title={`Adjust ${item.phase} duration`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Talent List */}
                <div className="lg:col-span-1">
                    <Card className="p-6 h-full flex flex-col bg-[var(--bg-secondary)]/50 border-l border-[var(--border-subtle)]">
                        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Users size={18} /> Selected Talent</span>
                            <span className="text-sm bg-[var(--accent-primary)] text-black px-2 py-0.5 rounded-full">
                                {draft.selectedTalents.length}
                            </span>
                        </h3>

                        {draft.selectedTalents.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--text-muted)] p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-lg">
                                <Users size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">No talents added yet.</p>
                                <p className="text-xs mt-1">Browse talents and click "Add to Project" to build your team.</p>
                                <Button className="mt-4" variant="secondary" size="sm" onClick={() => window.location.href = '/talents'}>
                                    Browse Talent
                                </Button>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                {draft.selectedTalents.map((talent) => (
                                    <div key={talent.talent_id} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-lg group hover:ring-1 hover:ring-[var(--border-default)] transition-all">
                                        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] overflow-hidden flex-shrink-0">
                                            {talent.profile_photo_url ? (
                                                <img src={talent.profile_photo_url} alt={talent.display_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold">{talent.display_name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{talent.display_name}</div>
                                            <div className="text-xs text-[var(--text-muted)] truncate">{talent.roles?.[0]?.role_name || 'Creative'}</div>
                                        </div>
                                        <button
                                            onClick={() => removeFromProject(talent.talent_id)}
                                            className="text-[var(--text-muted)] hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-[var(--border-default)]">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-secondary)]">Est. Talent Fees</span>
                                <span className="font-mono font-bold">~{formatCurrency(draft.selectedTalents.length * 1500, draft.currency)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

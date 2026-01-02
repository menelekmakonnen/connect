'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select } from '@/components/ui';
import type { ProjectType, BudgetTier } from '@/lib/types';
import { ArrowLeft, ArrowRight, Calendar, MapPin, FileText, DollarSign, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

const projectTypes = [
    { value: 'music_video', label: 'Music Video' },
    { value: 'brand_shoot', label: 'Brand Shoot' },
    { value: 'short_film', label: 'Short Film' },
    { value: 'doc', label: 'Documentary' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Other' },
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

// Role slot templates by project type
const roleTemplates: Record<string, { role: string; qty: number }[]> = {
    music_video: [
        { role: 'Director of Photography (DP)', qty: 1 },
        { role: 'Camera Operator', qty: 1 },
        { role: 'Gaffer', qty: 1 },
        { role: 'Makeup Artist', qty: 1 },
        { role: 'Model', qty: 2 },
        { role: 'BTS Videographer', qty: 1 },
    ],
    brand_shoot: [
        { role: 'Photographer', qty: 1 },
        { role: 'Model', qty: 2 },
        { role: 'Makeup Artist', qty: 1 },
        { role: 'Wardrobe Stylist', qty: 1 },
    ],
    short_film: [
        { role: 'Director of Photography (DP)', qty: 1 },
        { role: 'Camera Operator', qty: 1 },
        { role: 'Sound Recordist', qty: 1 },
        { role: 'Gaffer', qty: 1 },
        { role: 'Makeup Artist', qty: 1 },
        { role: 'Editor', qty: 1 },
        { role: 'Actor', qty: 3 },
    ],
    doc: [
        { role: 'Director of Photography (DP)', qty: 1 },
        { role: 'Sound Recordist', qty: 1 },
        { role: 'Editor', qty: 1 },
    ],
    event: [
        { role: 'Photographer', qty: 2 },
        { role: 'BTS Videographer', qty: 1 },
        { role: 'Makeup Artist', qty: 2 },
    ],
    other: [],
};

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
        visibility: 'public', // Default to public
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [loading_create, setLoadingCreate] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoadingCreate(true);
            const res = await api.projects.create(formData);
            // Redirect to the new project page
            router.push(`/projects/${res.project_id}`);
        } catch (err) {
            console.error('Failed to create project:', err);
            alert('Failed to create project. Please try again.');
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
        <div className="page-container animate-fade-in max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4">
                    <ArrowLeft size={16} />
                    Back to Projects
                </Link>
                <h1 className="text-2xl font-semibold mb-2">New Project</h1>
                <p className="text-[var(--text-secondary)]">
                    Set up your project details, then build your lineup.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s === step
                            ? 'bg-[var(--accent-primary)] text-black'
                            : s < step
                                ? 'bg-[var(--req-accepted)] text-white'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                            }`}>
                            {s < step ? '✓' : s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-0.5 ${s < step ? 'bg-[var(--req-accepted)]' : 'bg-[var(--bg-elevated)]'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Basics */}
            {step === 1 && (
                <Card className="p-6 animate-fade-in">
                    <h2 className="text-lg font-medium mb-6">Project Basics</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Title</label>
                            <Input
                                placeholder="e.g., Sarkodie Music Video, Brand Campaign Q1"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {projectTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => updateField('type', type.value)}
                                        className={`p-4 rounded-lg border text-left transition-all ${formData.type === type.value
                                            ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]'
                                            : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Client Name (Optional)</label>
                            <Input
                                placeholder="e.g., MTN Ghana, Universal Music"
                                value={formData.client_name}
                                onChange={(e) => updateField('client_name', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 2: Schedule & Location */}
            {step === 2 && (
                <Card className="p-6 animate-fade-in">
                    <h2 className="text-lg font-medium mb-6">Schedule & Location</h2>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Calendar size={14} className="inline mr-1.5" />
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => updateField('start_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Calendar size={14} className="inline mr-1.5" />
                                    End Date (Optional)
                                </label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => updateField('end_date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <MapPin size={14} className="inline mr-1.5" />
                                City
                            </label>
                            <Select
                                options={[{ value: '', label: 'Select city...' }, ...cityOptions]}
                                value={formData.location_city}
                                onChange={(e) => updateField('location_city', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Location Details (Optional)</label>
                            <Input
                                placeholder="e.g., Studio, outdoor location, multiple locations"
                                value={formData.location_notes}
                                onChange={(e) => updateField('location_notes', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* Step 3: Budget & Brief */}
            {step === 3 && (
                <Card className="p-6 animate-fade-in">
                    <h2 className="text-lg font-medium mb-6">Budget & Brief</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <DollarSign size={14} className="inline mr-1.5" />
                                Budget Tier
                            </label>
                            <div className="space-y-2">
                                {budgetTiers.map((tier) => (
                                    <button
                                        key={tier.value}
                                        onClick={() => updateField('budget_tier', tier.value)}
                                        className={`w-full p-4 rounded-lg border text-left transition-all flex items-center justify-between ${formData.budget_tier === tier.value
                                            ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]'
                                            : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-sm font-medium block">{tier.label}</span>
                                            <span className="text-xs text-[var(--text-muted)]">{tier.description}</span>
                                        </div>
                                        {formData.budget_tier === tier.value && (
                                            <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            className="input min-h-[120px] resize-none"
                            placeholder="Describe the project, vision, references, and any special requirements..."
                            value={formData.brief}
                            onChange={(e) => updateField('brief', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Globe size={14} className="inline mr-1.5" />
                            Project Visibility
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => updateField('visibility', 'public')}
                                className={`p-4 rounded-lg border text-left transition-all ${formData.visibility === 'public'
                                    ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]'
                                    : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                                    }`}
                            >
                                <span className="text-sm font-medium flex items-center mb-1">
                                    <Globe size={16} className="mr-2" />
                                    Public (Open)
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                    Anyone can see and apply. Best for finding new talent.
                                </span>
                            </button>

                            <button
                                onClick={() => updateField('visibility', 'private')}
                                className={`p-4 rounded-lg border text-left transition-all ${formData.visibility === 'private'
                                    ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)]'
                                    : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                                    }`}
                            >
                                <span className="text-sm font-medium flex items-center mb-1">
                                    <Lock size={16} className="mr-2" />
                                    Private (Invite Only)
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                    Only people you invite can see this project.
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Role Template Preview */}
                    {formData.type && roleTemplates[formData.type]?.length > 0 && (
                        <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                            <p className="text-sm font-medium mb-2">Suggested Roles</p>
                            <p className="text-xs text-[var(--text-muted)] mb-3">
                                Based on your project type, we&apos;ll pre-fill these role slots:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {roleTemplates[formData.type].map((slot, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-[var(--bg-glass)] text-xs">
                                        {slot.qty}x {slot.role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                {step > 1 ? (
                    <Button variant="secondary" onClick={() => setStep(step - 1)}>
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                        Next
                        <ArrowRight size={16} />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!canProceed() || loading_create}>
                        {loading_create ? <Loader2 className="animate-spin" /> : 'Create Project'}
                        <ArrowRight size={16} />
                    </Button>
                )}
            </div>
        </div >
    );
}

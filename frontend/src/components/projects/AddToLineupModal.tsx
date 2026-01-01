'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Avatar, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api';
import { Talent, RoleSlot } from '@/lib/types';
import {
    X,
    Search,
    UserPlus,
    Loader2,
    CheckCircle2,
    MapPin,
    DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AddToLineupModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    roleSlot: RoleSlot | null;
    onAdded: () => void;
}

export function AddToLineupModal({ isOpen, onClose, projectId, roleSlot, onAdded }: AddToLineupModalProps) {
    const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search');
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Selection state
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

    useEffect(() => {
        if (isOpen && roleSlot) {
            loadTalents(roleSlot.role_name); // Pre-filter by role
            setStep('search');
            setSearchTerm('');
            setSelectedTalent(null);
        }
    }, [isOpen, roleSlot]);

    const loadTalents = async (roleFilter?: string, query?: string) => {
        try {
            setLoading(true);
            const params: any = {};
            if (roleFilter) params.roles = roleFilter;
            if (query) params.query = query;

            const data = await api.talents.search(params);
            setTalents(data.talents);
        } catch (err) {
            console.error('Failed to load talents', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadTalents(undefined, searchTerm); // Search globally if user changes query
    };

    const handleAdd = async () => {
        if (!selectedTalent || !roleSlot) return;

        try {
            setLoading(true);
            await api.projects.addToLineup(projectId, {
                slot_id: roleSlot.slot_id,
                talent_id: selectedTalent.talent_id
            });
            setStep('success');
            onAdded();
        } catch (err) {
            console.error('Failed to add to lineup', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !roleSlot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
                {/* Close Button */}
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white z-10"
                >
                    <X size={20} />
                </button>

                {/* Steps */}
                {step === 'search' && (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-[var(--border-subtle)]">
                            <h2 className="text-xl font-bold mb-1">Add to Lineup</h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Select a talent for the <span className="text-[var(--text-primary)] font-medium">{roleSlot.role_name}</span> role.
                            </p>

                            <form onSubmit={handleSearch} className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search talents by name, role, or skill..."
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg py-2 pl-10 pr-4 outline-none focus:border-[var(--accent-primary)]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-[var(--accent-primary)]" />
                                </div>
                            ) : talents.length === 0 ? (
                                <div className="text-center p-8 text-[var(--text-muted)]">
                                    <p>No talents found matching your criteria.</p>
                                    <Button
                                        variant="ghost"
                                        className="mt-2"
                                        onClick={() => loadTalents()}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            ) : (
                                talents.map(talent => (
                                    <div
                                        key={talent.talent_id}
                                        onClick={() => {
                                            setSelectedTalent(talent);
                                            setStep('confirm');
                                        }}
                                        className="p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors border border-transparent hover:border-[var(--accent-primary)] flex items-center gap-4"
                                    >
                                        <Avatar src={talent.avatar_url} alt={talent.display_name} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold truncate">{talent.display_name}</h3>
                                                {talent.verification_level !== 'unverified' && (
                                                    <CheckCircle2 size={14} className="text-[var(--verified-badge)]" />
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] truncate">{talent.headline}</p>

                                            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {talent.city}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign size={12} />
                                                    {formatCurrency(talent.day_rate_min || 0)}
                                                </span>
                                            </div>
                                        </div>

                                        <Button size="sm" variant="ghost">Select</Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {step === 'confirm' && selectedTalent && (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-[var(--border-subtle)]">
                            <button
                                onClick={() => setStep('search')}
                                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 flex items-center gap-1"
                            >
                                ← Back to Search
                            </button>
                            <h2 className="text-xl font-bold">Confirm Selection</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-[var(--bg-elevated)]">
                                <img src={selectedTalent.avatar_url} alt={selectedTalent.display_name} className="w-full h-full object-cover" />
                            </div>

                            <h3 className="text-2xl font-bold mb-1">{selectedTalent.display_name}</h3>
                            <p className="text-[var(--text-secondary)] mb-6">{selectedTalent.headline}</p>

                            <div className="bg-[var(--bg-elevated)] p-4 rounded-lg w-full max-w-sm mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-[var(--text-muted)]">Adding to role:</span>
                                    <span className="font-medium">{roleSlot.role_name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-muted)]">Status:</span>
                                    <StatusBadge status="shortlisted" />
                                </div>
                            </div>

                            <p className="text-sm text-[var(--text-muted)] max-w-md">
                                This will add {selectedTalent.display_name} to the lineup as &quot;Shortlisted&quot;.
                                They won&apos;t be notified until you send a booking request.
                            </p>
                        </div>

                        <div className="p-6 border-t border-[var(--border-subtle)]">
                            <Button
                                className="w-full"
                                onClick={handleAdd}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <UserPlus size={18} />
                                        Add to Lineup
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && selectedTalent && (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-in zoom-in">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Added to Lineup!</h2>
                        <p className="text-[var(--text-secondary)] mb-8">
                            {selectedTalent.display_name} has been added to the {roleSlot.role_name} slot.
                        </p>
                        <div className="flex gap-3 w-full max-w-xs">
                            <Button onClick={onClose} className="flex-1">
                                Done
                            </Button>
                            <Button variant="secondary" onClick={() => {
                                setStep('search');
                                setSelectedTalent(null);
                            }} className="flex-1">
                                Add Another
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

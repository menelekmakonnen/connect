'use client';

import { useState, useEffect } from 'react';
import { Button, Card } from '@/components/ui'; import { api } from '@/lib/api';
import { Project, RoleSlot } from '@/lib/types';
import {
    X,
    Send,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SendRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    talentId: string;
    talentName: string;
}

export function SendRequestModal({ isOpen, onClose, talentId, talentName }: SendRequestModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<'select-project' | 'compose' | 'success'>('select-project');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    // Selection state
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedRole, setSelectedRole] = useState<RoleSlot | null>(null);
    const [message, setMessage] = useState('');
    const [offerFee, setOfferFee] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadProjects();
            setStep('select-project');
        }
    }, [isOpen]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await api.projects.list({ status: 'active,planning' });
            setProjects(data);
        } catch (err) {
            console.error('Failed to load projects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!selectedProject || !selectedRole) return;

        try {
            setLoading(true);
            await api.requests.send({
                project_id: selectedProject.project_id,
                talent_id: talentId,
                role_name: selectedRole.role_name,
                slot_id: selectedRole.slot_id,
                message: message,
                offer_fee: parseInt(offerFee) || 0
            });
            setStep('success');
        } catch (err) {
            console.error('Failed to send request', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col relative">
                {/* Close Button */}
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white"
                >
                    <X size={20} />
                </button>

                {/* Steps */}
                {step === 'select-project' && (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-[var(--border-subtle)]">
                            <h2 className="text-xl font-bold mb-1">Select Project</h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Which project are you booking {talentName} for?
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-[var(--accent-primary)]" />
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center p-8 text-[var(--text-muted)]">
                                    <p>No active projects found.</p>
                                    <Button
                                        variant="ghost"
                                        className="mt-2"
                                        onClick={() => router.push('/projects/new')}
                                    >
                                        Create New Project
                                    </Button>
                                </div>
                            ) : (
                                projects.map(proj => (
                                    <div
                                        key={proj.project_id}
                                        onClick={() => {
                                            setSelectedProject(proj);
                                            setStep('compose');
                                        }}
                                        className="p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors border border-transparent hover:border-[var(--accent-primary)]"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold">{proj.title}</span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                                                {formatDate(proj.start_date || '')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {proj.location_city} • {proj.type}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {step === 'compose' && selectedProject && (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                                <button onClick={() => setStep('select-project')} className="hover:text-[var(--accent-primary)]">
                                    Projects
                                </button>
                                <span>/</span>
                                <span>{selectedProject.title}</span>
                            </div>
                            <h2 className="text-xl font-bold">Request Details</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Role Select */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Role</label>
                                <select
                                    aria-label="Select Role"
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg p-2.5 outline-none focus:border-[var(--accent-primary)]"
                                    onChange={(e) => {
                                        const role = selectedProject.role_slots?.find(r => r.slot_id === e.target.value);
                                        setSelectedRole(role || null);
                                    }}
                                >
                                    <option value="">Select a role...</option>
                                    {selectedProject.role_slots?.map(slot => (
                                        <option key={slot.slot_id} value={slot.slot_id}>
                                            {slot.role_name} ({slot.qty} needed)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Offer */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Offer Fee (GHS)</label>
                                <input
                                    type="number"
                                    value={offerFee}
                                    onChange={(e) => setOfferFee(e.target.value)}
                                    placeholder={selectedRole?.target_fee ? `Target: ${selectedRole.target_fee}` : "Enter amount"}
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg p-2.5 outline-none focus:border-[var(--accent-primary)]"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg p-2.5 outline-none focus:border-[var(--accent-primary)]"
                                    placeholder="Hi! We'd love to have you on this project..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border-subtle)]">
                            <Button
                                className="w-full"
                                onClick={handleSend}
                                disabled={!selectedRole || loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <Send size={18} />
                                        Send Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-in zoom-in">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
                        <p className="text-[var(--text-secondary)] mb-8">
                            {talentName} has been notified. You&apos;ll see their response in the project dashboard.
                        </p>
                        <Button onClick={onClose} className="w-full">
                            Done
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

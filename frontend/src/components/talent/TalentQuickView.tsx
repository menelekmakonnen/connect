'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button, Card, RoleBadge, VerificationBadge, AvailabilityBadge } from '@/components/ui';
import { formatRateRange } from '@/lib/utils';
import { X, MapPin, ExternalLink, Plus, Check } from 'lucide-react';

export function TalentQuickView() {
    const {
        quickViewTalent: talent,
        closeQuickView,
        addToProject,
        draft
    } = useAppStore();

    // Check if already in project
    const isInProject = talent ? draft.selectedTalents.some(t => t.talent_id === talent.talent_id) : false;

    // Prevent hydration issues
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !talent) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={closeQuickView} />

            <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Image */}
                    <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-black">
                        {talent.profile_photo_url ? (
                            <img
                                src={talent.profile_photo_url}
                                alt={talent.display_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--text-muted)] font-bold">
                                {(talent.display_name || 'A').charAt(0)}
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

                        <div className="absolute bottom-4 left-4 md:hidden">
                            <h2 className="text-2xl font-bold text-white shadow-sm">{talent.display_name || 'Anonymous'}</h2>
                            <VerificationBadge level={talent.verification_level || 'unverified'} />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                        <div className="hidden md:block mb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{talent.display_name || 'Anonymous'}</h2>
                                    <div className="flex items-center gap-2">
                                        <VerificationBadge level={talent.verification_level || 'unverified'} showLabel />
                                        <span className="text-[var(--text-muted)]">•</span>
                                        <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm">
                                            <MapPin size={14} />
                                            {talent.city || 'Location Hidden'}
                                        </div>
                                    </div>
                                </div>
                                <AvailabilityBadge status={talent.availability_status || 'available'} showLabel />
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-[var(--text-primary)] leading-snug">
                                {talent.headline || "Experienced creative professional ready for your next project."}
                            </h3>
                        </div>

                        {/* Roles */}
                        <div className="mb-6 space-y-2">
                            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Roles</h4>
                            <div className="flex flex-wrap gap-2">
                                {(talent.roles || []).map((role) => (
                                    <RoleBadge
                                        key={role.role_id}
                                        name={role.role_name}
                                        category={role.role_category}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Rate */}
                        {(talent as any).rate_range && (
                            <div className="mb-8 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                                <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Standard Rate</div>
                                <div className="text-xl font-bold text-[var(--accent-primary)]">
                                    {formatRateRange(
                                        (talent as any).rate_range.min,
                                        (talent as any).rate_range.max,
                                        (talent as any).rate_range.currency
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto grid grid-cols-2 gap-4">
                            <Link href={`/talents/${talent.public_slug || talent.talent_id}`} onClick={closeQuickView} className="w-full">
                                <Button variant="secondary" className="w-full h-12">
                                    View Full Profile
                                    <ExternalLink size={16} className="ml-2" />
                                </Button>
                            </Link>

                            <Button
                                className={isInProject ? "bg-green-600 hover:bg-green-700 h-12" : "bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-secondary)] h-12"}
                                onClick={() => {
                                    if (!isInProject) addToProject(talent);
                                }}
                                disabled={isInProject}
                            >
                                {isInProject ? (
                                    <>
                                        <Check size={18} className="mr-2" />
                                        Added
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} className="mr-2" />
                                        Add to Project
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

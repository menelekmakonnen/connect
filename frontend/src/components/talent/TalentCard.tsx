'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Star, MapPin, Zap, X } from 'lucide-react';
import { Card, RoleBadge, VerificationBadge } from '@/components/ui';
import { formatRateRange, cn } from '@/lib/utils';
import type { TalentCard as TalentCardType } from '@/lib/types';
import Image from 'next/image';
import { RoleSelectionModal } from '@/components/projects/RoleSelectionModal';

interface TalentCardProps {
    talent: TalentCardType;
    onShortlist?: () => void;
}

export function TalentCard({ talent }: TalentCardProps) {
    const { openQuickView, addToProject, removeFromProject, draft } = useAppStore();
    const [showRoleModal, setShowRoleModal] = useState(false);

    const isInProject = draft.selectedTalents.some(t => t.talent_id === talent.talent_id);

    const handleToggleProject = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInProject) {
            // Remove from project
            removeFromProject(talent.talent_id);
        } else {
            // Show role selection modal
            setShowRoleModal(true);
        }
    };

    const handleRoleConfirm = (role?: string) => {
        // Pass role to store when adding
        addToProject(talent, role);
    };

    return (
        <div onClick={() => openQuickView(talent)} className="cursor-pointer h-full group/card">
            <Card
                variant="interactive"
                className={cn(
                    'p-0 overflow-hidden h-full transition-all duration-500 rounded-[32px] border border-white/5 hover:border-purple-500/30 bg-[#1e2130] shadow-xl hover-lift group/item',
                    talent.featured && 'ring-1 ring-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]'
                )}
            >
                {/* Header with Photo - Film Frame Aesthetic */}
                <div className="relative h-64 overflow-hidden">
                    {talent.profile_photo_url ? (
                        <Image
                            src={talent.profile_photo_url}
                            alt={talent.display_name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                            onError={(e) => {
                                // Hide broken image and show fallback
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    {/* Fallback initials - always rendered but hidden if image loads */}
                    <div className={cn(
                        "w-full h-full flex items-center justify-center text-4xl font-black text-slate-300 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 uppercase tracking-tighter backdrop-blur-sm border border-white/5",
                        talent.profile_photo_url && "hidden"
                    )}>
                        {(talent.display_name || 'Anonymous').split(' ').map(n => n ? n[0] : '').join('').slice(0, 2)}
                    </div>

                    {/* Elite Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {talent.featured && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest shadow-2xl border border-purple-400/30">
                                <Star size={10} fill="currentColor" />
                                Featured Talent
                            </div>
                        )}
                        <VerificationBadge level={talent.verification_level || 'unverified'} showLabel={true} className="rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-[#0f1117]/80 backdrop-blur-md border border-white/10" />
                    </div>

                    {/* Add/Remove Project Button */}
                    <button
                        onClick={handleToggleProject}
                        className={cn(
                            "absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all z-20 shadow-2xl border",
                            isInProject
                                ? "bg-red-500 border-red-400 text-white shadow-red-500/20 hover:bg-red-600"
                                : "bg-black/40 border-white/10 text-white hover:bg-purple-600 hover:border-purple-400 hover:scale-110"
                        )}
                        title={isInProject ? "Remove from Project" : "Add to Project"}
                    >
                        {isInProject ? <X size={20} className="animate-in zoom-in duration-300" /> : <Plus size={22} />}
                    </button>

                    {/* Cinema Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/40 to-transparent pointer-events-none" />
                </div>

                {/* Content Area - Premium Refusal of Defaults */}
                <div className="p-6 -mt-10 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white group-hover/card:text-purple-400 transition-colors tracking-tight uppercase truncate">
                                {talent.display_name || 'Anonymous'}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <MapPin size={10} className="text-slate-700" />
                                {talent.city || 'Location Hidden'}
                            </div>
                        </div>

                        {/* Professional Headline */}
                        {talent.headline && (
                            <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-2 min-h-[2rem]">
                                {talent.headline}
                            </p>
                        )}

                        {/* Skill Matrices */}
                        <div className="flex flex-wrap gap-2">
                            {(talent.roles || []).slice(0, 2).map((role) => (
                                <RoleBadge
                                    key={role.role_id}
                                    name={role.role_name}
                                    category={role.role_category}
                                    className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                />
                            ))}
                            {(talent.roles || []).length > 2 && (
                                <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    +{(talent.roles || []).length - 2} More
                                </div>
                            )}
                        </div>

                        {/* Financial Indicator */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-purple-500" />
                                <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                                    {talent.rate_range
                                        ? formatRateRange(talent.rate_range.min, talent.rate_range.max, talent.rate_range.currency)
                                        : 'Rates on Request'}
                                </span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_var(--green-500)]" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Role Selection Modal */}
            <RoleSelectionModal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                talent={talent}
                onConfirm={handleRoleConfirm}
                projectRoles={[]} // TODO: Pass actual project roles when available
            />
        </div>
    );
}

export function TalentCardSkeleton() {
    return (
        <Card className="p-0 overflow-hidden h-[420px] rounded-[32px] border-white/5 bg-[#1e2130] animate-pulse">
            <div className="h-64 bg-white/5" />
            <div className="p-6 -mt-10 relative">
                <div className="h-8 bg-white/5 rounded-xl w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded-lg w-1/2 mb-6" />
                <div className="flex gap-2 mb-6">
                    <div className="h-8 bg-white/5 rounded-lg w-20" />
                    <div className="h-8 bg-white/5 rounded-lg w-24" />
                </div>
                <div className="h-10 bg-white/5 rounded-xl w-full" />
            </div>
        </Card>
    );
}

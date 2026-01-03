'use client';

import { useAppStore } from '@/lib/store';
import { Plus, Check, Star, MapPin, Zap } from 'lucide-react';
import { Card, RoleBadge, VerificationBadge } from '@/components/ui';
import { formatRateRange, cn } from '@/lib/utils';
import type { TalentCard as TalentCardType } from '@/lib/types';
import Image from 'next/image';

interface TalentCardProps {
    talent: TalentCardType;
    onShortlist?: () => void;
}

export function TalentCard({ talent, onShortlist }: TalentCardProps) {
    const { openQuickView, addToProject, draft } = useAppStore();

    const isInProject = draft.selectedTalents.some(t => t.talent_id === talent.talent_id);

    const handleAddToProject = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isInProject) {
            addToProject(talent);
        }
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
                            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-800 bg-[#0f1117] uppercase tracking-tighter">
                            {talent.display_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}

                    {/* Elite Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {talent.featured && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest shadow-2xl border border-purple-400/30">
                                <Star size={10} fill="currentColor" />
                                Featured Talent
                            </div>
                        )}
                        <VerificationBadge level={talent.verification_level} showLabel={true} className="rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-[#0f1117]/80 backdrop-blur-md border border-white/10" />
                    </div>

                    {/* Add to Project Button - Floating UI approach */}
                    <button
                        onClick={handleAddToProject}
                        className={cn(
                            "absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all z-20 shadow-2xl border",
                            isInProject
                                ? "bg-green-500 border-green-400 text-white shadow-green-500/20"
                                : "bg-black/40 border-white/10 text-white hover:bg-purple-600 hover:border-purple-400 hover:scale-110"
                        )}
                        title={isInProject ? "Added to Project" : "Add to Project"}
                    >
                        {isInProject ? <Check size={20} className="animate-in zoom-in duration-300" /> : <Plus size={22} />}
                    </button>

                    {/* Cinema Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/40 to-transparent pointer-events-none" />
                </div>

                {/* Content Area - Premium Refusal of Defaults */}
                <div className="p-6 -mt-10 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white group-hover/card:text-purple-400 transition-colors tracking-tight uppercase truncate">
                                {talent.display_name}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <MapPin size={10} className="text-slate-700" />
                                {talent.city || 'Accra, Ghana'}
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
                            {talent.roles.slice(0, 2).map((role) => (
                                <RoleBadge
                                    key={role.role_id}
                                    name={role.role_name}
                                    category={role.role_category}
                                    className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                />
                            ))}
                            {talent.roles.length > 2 && (
                                <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    +{talent.roles.length - 2} More
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

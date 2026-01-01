'use client';

import { useAppStore } from '@/lib/store';
import { Plus, Check, Star, MapPin } from 'lucide-react';
import { Card, RoleBadge, VerificationBadge, AvailabilityBadge } from '@/components/ui';
import { formatRateRange, cn } from '@/lib/utils';
import type { TalentCard as TalentCardType } from '@/lib/types';

interface TalentCardProps {
    talent: TalentCardType;
    onShortlist?: () => void;
}

export function TalentCard({ talent, onShortlist }: TalentCardProps) {
    const { openQuickView, addToProject, draft } = useAppStore();

    const isInProject = draft.selectedTalents.some(t => t.talent_id === talent.talent_id);

    // Prevent default link behavior for internal buttons
    const handleAddToProject = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isInProject) {
            addToProject(talent);
        }
    };

    return (
        <div onClick={() => openQuickView(talent)} className="cursor-pointer">
            <Card
                variant="interactive"
                className={cn(
                    'p-0 overflow-hidden group',
                    talent.featured && 'ring-1 ring-[var(--accent-primary)]/30'
                )}
            >
                {/* Header with Photo */}
                <div className="relative h-48 bg-[var(--bg-elevated)]">
                    {talent.profile_photo_url ? (
                        <img
                            src={talent.profile_photo_url}
                            alt={talent.display_name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-[var(--text-muted)]">
                            {talent.display_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}

                    {/* Featured Badge */}
                    {talent.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--accent-primary)] text-black text-xs font-medium">
                            <Star size={12} fill="currentColor" />
                            Featured
                        </div>
                    )}

                    {/* Add to Project Button (Plus) */}
                    <button
                        onClick={handleAddToProject}
                        className={cn(
                            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 shadow-lg",
                            isInProject ? "bg-green-500 text-white" : "bg-black/60 text-white hover:bg-[var(--accent-primary)] hover:text-black hover:scale-110"
                        )}
                        title={isInProject ? "Added to Project" : "Add to Project"}
                    >
                        {isInProject ? <Check size={16} /> : <Plus size={18} />}
                    </button>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-glass)] to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 -mt-8 relative">
                    {/* Name + Verification */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base truncate">{talent.display_name}</h3>
                        <VerificationBadge level={talent.verification_level} showLabel={false} />
                    </div>

                    {/* Headline */}
                    {talent.headline && (
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mb-3">
                            {talent.headline}
                        </p>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-3">
                        <MapPin size={12} />
                        {talent.city}
                    </div>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {talent.roles.slice(0, 3).map((role) => (
                            <RoleBadge
                                key={role.role_id}
                                name={role.role_name}
                                category={role.role_category}
                            />
                        ))}
                        {talent.roles.length > 3 && (
                            <span className="role-badge bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                                +{talent.roles.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Rate (if public) */}
                    {talent.rate_range && (
                        <div className="pt-3 border-t border-[var(--border-subtle)]">
                            <p className="text-sm font-medium text-[var(--accent-primary)]">
                                {formatRateRange(talent.rate_range.min, talent.rate_range.max, talent.rate_range.currency)}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

// Skeleton for loading state
export function TalentCardSkeleton() {
    return (
        <Card className="p-0 overflow-hidden animate-pulse">
            <div className="h-48 bg-[var(--bg-elevated)]" />
            <div className="p-4 -mt-8 relative">
                <div className="h-5 bg-[var(--bg-elevated)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                    <div className="h-6 bg-[var(--bg-elevated)] rounded-full w-16" />
                    <div className="h-6 bg-[var(--bg-elevated)] rounded-full w-20" />
                </div>
            </div>
        </Card>
    );
}

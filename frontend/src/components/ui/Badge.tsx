'use client';

import { cn, getRoleCategoryClass, getStatusClass, getStatusLabel, getVerificationInfo } from '@/lib/utils';
import type { RoleCategory, VerificationLevel } from '@/lib/types';
import { Check, Shield, Star } from 'lucide-react';

interface RoleBadgeProps {
    name: string;
    category: RoleCategory;
    className?: string;
}

export function RoleBadge({ name, category, className }: RoleBadgeProps) {
    return (
        <span className={cn('role-badge', getRoleCategoryClass(category), className)}>
            {name}
        </span>
    );
}

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span className={cn('status-badge', getStatusClass(status), className)}>
            {getStatusLabel(status)}
        </span>
    );
}

interface VerificationBadgeProps {
    level: VerificationLevel;
    showLabel?: boolean;
    className?: string;
}

export function VerificationBadge({ level, showLabel = true, className }: VerificationBadgeProps) {
    const info = getVerificationInfo(level);

    if (!info.label) return null;

    if (level === 'pro_verified') {
        return (
            <span className={cn('pro-badge', className)}>
                <Star size={10} fill="currentColor" />
                PRO
            </span>
        );
    }

    return (
        <span className={cn('verified-badge', className)}>
            <Shield size={14} />
            {showLabel && info.label}
        </span>
    );
}

interface AvailabilityBadgeProps {
    status: 'available' | 'limited' | 'unavailable';
    showLabel?: boolean;
    className?: string;
}

export function AvailabilityBadge({ status, showLabel = false, className }: AvailabilityBadgeProps) {
    const labels = {
        available: 'Available',
        limited: 'Limited',
        unavailable: 'Unavailable',
    };

    return (
        <span className={cn('inline-flex items-center gap-1.5', className)}>
            <span className={cn('availability-dot', `availability-dot--${status}`)} />
            {showLabel && (
                <span className="text-xs text-[var(--text-secondary)]">{labels[status]}</span>
            )}
        </span>
    );
}

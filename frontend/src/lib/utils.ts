// ICUNI Connect - Utility Functions

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'GHS'): string {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format rate range for display
 */
export function formatRateRange(min?: number, max?: number, currency: string = 'GHS'): string {
    if (!min && !max) return 'Rates on request';
    if (min && max && min !== max) {
        return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
    }
    return `From ${formatCurrency(min || max || 0, currency)}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
}

/**
 * Get CSS class for role category
 */
export function getRoleCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
        'Cast': 'role-badge--cast',
        'Production': 'role-badge--production',
        'Camera': 'role-badge--camera',
        'Sound': 'role-badge--sound',
        'Lighting/Grip': 'role-badge--lighting',
        'Art/Wardrobe': 'role-badge--art',
        'HairMakeup': 'role-badge--hairmakeup',
        'Post': 'role-badge--post',
        'Stills': 'role-badge--stills',
        'Services': 'role-badge--services',
    };
    return categoryMap[category] || 'role-badge--services';
}

/**
 * Get CSS class for availability status
 */
export function getAvailabilityClass(status: string): string {
    return `availability-dot--${status}`;
}

/**
 * Get CSS class for request/lineup status
 */
export function getStatusClass(status: string): string {
    return `status-badge--${status}`;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Convert project type to display label
 */
export function getProjectTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        music_video: 'Music Video',
        brand_shoot: 'Brand Shoot',
        short_film: 'Short Film',
        doc: 'Documentary',
        event: 'Event',
        other: 'Other',
    };
    return labels[type] || type;
}

/**
 * Convert status to display label
 */
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        draft: 'Draft',
        staffing: 'Staffing',
        requests_sent: 'Requests Sent',
        locked: 'Locked',
        booked: 'Booked',
        completed: 'Completed',
        cancelled: 'Cancelled',
        shortlisted: 'Shortlisted',
        invited: 'Invited',
        accepted: 'On Hold',
        declined: 'Declined',
        negotiating: 'Negotiating',
        removed: 'Removed',
        sent: 'Sent',
        viewed: 'Viewed',
        question: 'Question',
        countered: 'Counter Offer',
        expired: 'Expired',
    };
    return labels[status] || status;
}

/**
 * Convert verification level to display info
 */
export function getVerificationInfo(level: string): { label: string; color: string } {
    const info: Record<string, { label: string; color: string }> = {
        unverified: { label: '', color: '' },
        profile_verified: { label: 'Verified', color: 'var(--verified-badge)' },
        work_verified: { label: 'Work Verified', color: 'var(--verified-badge)' },
        pro_verified: { label: 'Pro', color: 'var(--pro-badge)' },
    };
    return info[level] || { label: '', color: '' };
}

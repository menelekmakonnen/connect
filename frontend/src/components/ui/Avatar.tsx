'use client';

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showVerified?: boolean;
}

export function Avatar({ src, alt, size = 'md', className, showVerified }: AvatarProps) {
    const sizeClasses = {
        sm: 'avatar--sm',
        md: 'avatar--md',
        lg: 'avatar--lg',
        xl: 'avatar--xl',
    };

    return (
        <div className={cn('avatar', sizeClasses[size], className)}>
            {src ? (
                <img src={src} alt={alt} />
            ) : (
                <span className="text-[var(--text-muted)] font-medium">
                    {getInitials(alt)}
                </span>
            )}
            {showVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--verified-badge)] rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
        </div>
    );
}

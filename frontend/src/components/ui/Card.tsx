'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'interactive' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: 'glass-card p-4',
            interactive: 'glass-card p-4 cursor-pointer hover:scale-[1.01] hover:shadow-lg transition-transform',
            elevated: 'bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-4',
        };

        return (
            <div
                ref={ref}
                className={cn(variants[variant], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-lg font-semibold', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-[var(--text-secondary)]', className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2', className)} {...props}>
            {children}
        </div>
    );
}

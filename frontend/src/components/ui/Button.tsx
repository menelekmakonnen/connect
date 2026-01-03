'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link' | 'gradient';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'btn inline-flex items-center justify-center transition-all duration-300 font-bold active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            ghost: 'btn-ghost',
            danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
            outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
            link: 'bg-transparent text-purple-400 hover:text-purple-300 p-0 h-auto underline-offset-4 hover:underline',
            gradient: 'btn-gradient border-none text-white shadow-lg shadow-purple-500/20'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs rounded-lg',
            md: 'px-5 py-2.5 text-sm rounded-xl',
            lg: 'px-6 py-3 text-base rounded-2xl',
            xl: 'px-8 py-4 text-lg rounded-3xl'
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

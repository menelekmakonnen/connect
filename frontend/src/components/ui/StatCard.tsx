'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: string | number;
        isPositive: boolean;
    };
    className?: string;
    variant?: 'purple' | 'cyan' | 'pink' | 'green';
}

export function StatCard({ label, value, icon: Icon, trend, className, variant = 'purple' }: StatCardProps) {
    const variantStyles = {
        purple: {
            gradient: 'from-purple-600 to-pink-500',
            glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
            iconBg: 'bg-purple-500/10',
            iconText: 'text-purple-400'
        },
        cyan: {
            gradient: 'from-cyan-500 to-purple-500',
            glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            iconBg: 'bg-cyan-500/10',
            iconText: 'text-cyan-400'
        },
        pink: {
            gradient: 'from-pink-500 to-orange-500',
            glow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]',
            iconBg: 'bg-pink-500/10',
            iconText: 'text-pink-400'
        },
        green: {
            gradient: 'from-green-500 to-cyan-500',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
            iconBg: 'bg-green-500/10',
            iconText: 'text-green-400'
        },
    };

    const style = variantStyles[variant];

    return (
        <div className={cn(
            "bg-[#1e2130] border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-white/10 group hover-lift relative overflow-hidden",
            style.glow,
            className
        )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-start justify-between relative z-10">
                <div className={cn("p-4 rounded-2xl transition-all duration-500 group-hover:scale-110", style.iconBg)}>
                    {Icon && <Icon size={24} className={cn("transition-colors", style.iconText)} />}
                </div>
                {trend && (
                    <div className={cn(
                        "text-[10px] font-black px-2.5 py-1.5 rounded-xl border uppercase tracking-wider",
                        trend.isPositive
                            ? "bg-green-500/5 text-green-400 border-green-500/20"
                            : "bg-red-500/5 text-red-400 border-red-500/20"
                    )}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>

            <div className="mt-8 relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className={cn(
                        "text-4xl font-black bg-gradient-to-br bg-clip-text text-transparent tracking-tighter",
                        style.gradient
                    )}>
                        {value}
                    </h3>
                </div>
            </div>
        </div>
    );
}

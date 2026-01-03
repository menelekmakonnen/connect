'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
    variant?: 'purple' | 'cyan' | 'green' | 'orange';
    className?: string;
}

export function ActivityItem({ icon: Icon, title, description, time, variant = 'purple', className }: ActivityItemProps) {
    const variantStyles = {
        purple: 'bg-purple-500/10 text-purple-400',
        cyan: 'bg-cyan-500/10 text-cyan-400',
        green: 'bg-green-500/10 text-green-400',
        orange: 'bg-orange-500/10 text-orange-400',
    };

    return (
        <div className={cn(
            "flex gap-4 p-4 rounded-xl transition-all hover:bg-white/5 group",
            className
        )}>
            <div className={cn(
                "p-2.5 h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                variantStyles[variant]
            )}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

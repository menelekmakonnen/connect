'use client';

import { ActivityItem } from '@/components/ui';
import { Film, UserPlus, CheckCircle, Zap } from 'lucide-react';

const RECENT_ACTIVITY = [
    {
        icon: Film,
        title: "New Project Posted",
        description: "A feature film production is looking for a DP and Gaffer in Accra.",
        time: "2 mins ago",
        variant: "purple" as const
    },
    {
        icon: UserPlus,
        title: "New Talent Joined",
        description: "Michael B. joined as a Verified Senior Editor.",
        time: "15 mins ago",
        variant: "cyan" as const
    },
    {
        icon: CheckCircle,
        title: "Request Accepted",
        description: "Sarah L. has been booked for 'Morning Dew' music video.",
        time: "1 hour ago",
        variant: "green" as const
    },
    {
        icon: Zap,
        title: "Production Started",
        description: "'The Golden Coast' documentary has officially commenced staffing.",
        time: "3 hours ago",
        variant: "orange" as const
    }
];

export function ActivityFeed() {
    return (
        <section className="py-20 bg-[#1a1d29]/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Alive & Thriving Ecosystem
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            ICUNI Connect is more than just a directory. It's a living platform where productions come to life and careers are built every single day.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Real-time availability tracking",
                                "Instant notification system",
                                "Dynamic staffing engine",
                                "Verified community of professionals"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_var(--purple-500)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#1e2130] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
                        {/* Decorative Gradient Orb */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Zap size={20} className="text-purple-400" />
                                Recent Activity
                            </h3>
                            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            {RECENT_ACTIVITY.map((item, i) => (
                                <ActivityItem key={i} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { Card } from '@/components/ui';
import { Search, PlusCircle, Send, CheckSquare } from 'lucide-react';

const STEPS = [
    {
        icon: Search,
        title: "Browse Talent",
        description: "Discover verified creative professionals with rich portfolios and ratings.",
        variant: "purple" as const
    },
    {
        icon: PlusCircle,
        title: "Create Project",
        description: "Define your production roles, schedule, and budget requirements.",
        variant: "cyan" as const
    },
    {
        icon: Send,
        title: "Send Requests",
        description: "Send automated availability checks and booking requests instantly.",
        variant: "pink" as const
    },
    {
        icon: CheckSquare,
        title: "Staff Secured",
        description: "Confirm your crew and manage everything from a centralized dashboard.",
        variant: "green" as const
    }
];

export function HowItWorks() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Seamless Staffing in 4 Steps
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        ICUNI Connect streamlines your production workflow, taking you from search to staff in record time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step, i) => (
                        <Card key={i} className="bg-[#1e2130] border-white/5 p-8 relative group hover:border-purple-500/30 transition-all rounded-3xl">
                            <div className="absolute -top-6 left-8 h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-purple-500/20">
                                {i + 1}
                            </div>

                            <div className="mt-4 mb-6 text-slate-300 group-hover:text-purple-400 transition-colors">
                                <step.icon size={36} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

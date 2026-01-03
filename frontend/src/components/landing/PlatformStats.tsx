'use client';

import { StatCard } from '@/components/ui';
import { Users, FolderCheck, Trophy, Target } from 'lucide-react';

export function PlatformStats() {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <StatCard
                        label="Verified Talents"
                        value="500+"
                        icon={Users}
                        variant="purple"
                    />
                    <StatCard
                        label="Projects Completed"
                        value="1,200+"
                        icon={FolderCheck}
                        variant="cyan"
                    />
                    <StatCard
                        label="Success Rate"
                        value="98.5%"
                        icon={Trophy}
                        variant="green"
                    />
                    <StatCard
                        label="Active Productions"
                        value="45"
                        icon={Target}
                        variant="pink"
                    />
                </div>
            </div>
        </section>
    );
}

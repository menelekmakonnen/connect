'use client';

import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Check, ArrowRight } from 'lucide-react';

export default function PMCompletePage() {
    const router = useRouter();

    return (
        <div className="max-w-md mx-auto py-12 px-4 text-center">
            <Card className="p-8 animate-fade-in relative overflow-hidden">
                {/* Confetti/Success decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--role-camera)] to-[var(--accent-primary)]" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                    <Check className="text-green-500" size={40} />
                </div>

                <h1 className="text-2xl font-bold mb-2">Welcome Aboard!</h1>
                <p className="text-[var(--text-secondary)] mb-8">
                    Your Production Manager account has been created. You can now start building projects and finding talent.
                </p>

                <div className="space-y-3">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => router.push('/projects/new')}
                    >
                        Create Your First Project
                        <ArrowRight size={18} className="ml-2" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => router.push('/talents')}
                    >
                        Browse Talent Roster
                    </Button>
                </div>
            </Card>
        </div>
    );
}

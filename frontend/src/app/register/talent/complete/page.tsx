'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { CheckCircle2, ArrowRight, User } from 'lucide-react';

export default function RegistrationComplete() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold mb-3">Welcome to ICUNI Connect!</h1>
                <p className="text-[var(--text-secondary)] mb-8">
                    Your talent profile has been successfully created. You can now browse projects and receive requests from producers.
                </p>

                <div className="space-y-3">
                    <Link href="/dashboard" className="block">
                        <Button className="w-full" size="lg">
                            Go to Dashboard
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>

                    <Link href="/roster" className="block">
                        <Button variant="secondary" className="w-full">
                            <User size={18} className="mr-2" />
                            View My Public Profile
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Button, Card, RoleBadge } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CheckCircle2, Shield, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function VerificationPage() {
    return (
        <ProtectedRoute>
            <VerificationContent />
        </ProtectedRoute>
    );
}

function VerificationContent() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestVerification = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setStatus('pending');
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 mb-4">
                    <Shield className="w-8 h-8 text-[var(--accent-primary)]" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Get Verified</h1>
                <p className="text-[var(--text-secondary)] text-lg">
                    Build trust with productions and unlock premium features.
                </p>
            </div>

            {status === 'verified' ? (
                <Card className="p-8 text-center border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">You are Verified!</h2>
                    <p className="text-[var(--text-secondary)]">
                        Your account has been confirmed. You now have the verified badge on your profile.
                    </p>
                </Card>
            ) : status === 'pending' ? (
                <Card className="p-8 text-center border-yellow-500/20 bg-yellow-500/5">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                        <ClockIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
                    <p className="text-[var(--text-secondary)]">
                        We have received your request and our team is reviewing your documents.
                        This usually takes 24-48 hours.
                    </p>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-[var(--accent-primary)]" />
                            Why verify?
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                                Show up higher in search results
                            </li>
                            <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                                Gain access to premium job listings
                            </li>
                            <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                                Get the <span className="inline-flex items-center text-[var(--accent-primary)] text-xs font-medium ml-1 bg-[var(--accent-primary)]/10 px-1.5 py-0.5 rounded">Verified</span> badge on your profile
                            </li>
                        </ul>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold mb-6">Required Documents</h3>

                        <div className="space-y-4">
                            <div className="p-4 border border-dashed border-[var(--border-subtle)] rounded-lg bg-[var(--bg-hover)] text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                                </div>
                                <h4 className="font-medium mb-1">Upload Government ID</h4>
                                <p className="text-xs text-[var(--text-muted)]">Passport, Driver's License, or Ghana Card</p>
                            </div>

                            <div className="p-4 border border-dashed border-[var(--border-subtle)] rounded-lg bg-[var(--bg-hover)] text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                                </div>
                                <h4 className="font-medium mb-1">Portfolio Proof</h4>
                                <p className="text-xs text-[var(--text-muted)]">Call sheet or contract from a past project</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handleRequestVerification}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit for Verification'
                                )}
                            </Button>
                            <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                                By submitting, you agree to our Terms of Service regarding data processing.
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

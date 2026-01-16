'use client';

import { useRouter } from 'next/navigation';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card } from '@/components/ui';
import { Sparkles, ArrowRight, Zap, Users, Check } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    const handleSuccess = () => {
        // Redirect to the unified completion page
        router.push('/register/complete');
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="container max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Value Prop */}
                <div className="space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_var(--cyan-400)] animate-pulse" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                            Unified Access
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
                        One Account. <br />
                        <span className="gradient-text">Limitless Production.</span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Join Ghana's elite production network. Every account comes with full Producer capabilities.
                        Looking for work? Simply toggle "Available for Work" to get listed.
                    </p>

                    <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Zap size={20} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">Project Manager Mode</h3>
                                <p className="text-xs text-slate-400">Create projects, build lineups, and hire talent.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Users size={20} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">Talent Mode</h3>
                                <p className="text-xs text-slate-400">Toggle availability to showcase your portfolio and rates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sign Up Card */}
                <div className="w-full max-w-md mx-auto">
                    <Card className="p-8 backdrop-blur-xl bg-[#1a1d29]/80 border-white/10 shadow-2xl relative">
                        {/* Decorative Ring */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-20 pointer-events-none" />

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-white/10 mb-6 shadow-inner">
                                <Sparkles className="text-white" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Create Your ID</h2>
                            <p className="text-sm text-slate-400">Start staffing or get booked in seconds.</p>
                        </div>

                        <div className="space-y-6">
                            <GoogleSignInButton onSuccess={handleSuccess} />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-2 bg-[#1a1d29] text-slate-500">Security Verified</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                <Check size={12} className="text-green-500" /> No credit card required
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

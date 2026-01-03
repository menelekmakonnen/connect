'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import {
  ArrowRight,
  Sparkles,
  Zap,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { PlatformStats } from '@/components/landing/PlatformStats';
import { FeaturedTalents } from '@/components/landing/FeaturedTalents';
import { ActivityFeed } from '@/components/landing/ActivityFeed';
import { HowItWorks } from '@/components/landing/HowItWorks';

// Main CTA Component
function MainCTA({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  const router = useRouter();

  if (isLoading) return <Button className="opacity-50" disabled>Loading...</Button>;

  if (isAuthenticated) {
    return (
      <Button
        size="lg"
        className="btn-gradient px-8 py-6 rounded-2xl text-lg group"
        onClick={() => router.push('/dashboard')}
      >
        Enter Command Center
        <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/login">
        <Button
          size="lg"
          className="btn-gradient w-full sm:w-auto px-8 py-6 rounded-2xl text-lg group"
        >
          Start Staffing Now
          <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <Link href="/talents">
        <Button
          size="lg"
          className="w-full sm:w-auto px-8 py-6 rounded-2xl text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
        >
          <PlayCircle size={20} className="text-purple-400" />
          Explore Talent
        </Button>
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-white/5">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-slide-in-up">
            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_var(--purple-500)] animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Ghana's Premier Production Network
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1] animate-slide-in-up">
            Staff Your Next <br />
            <span className="gradient-text">Elite Shoot</span> In Minutes.
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-in-up">
            Connect with verified DPs, Editors, and Gaffers across Ghana.
            Automated availability checks, professional vetting, and seamless management.
          </p>

          <div className="flex justify-center animate-slide-in-up">
            <MainCTA isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </div>

          {/* Platform Stats Integration */}
          <div className="mt-24">
            <PlatformStats />
          </div>
        </div>
      </section>

      {/* Featured Talent Section - Primary Engagement for Non-Logged-In Users */}
      <FeaturedTalents />

      {/* How It Works - Clarity & Trust */}
      <HowItWorks />

      {/* Activity Feed - Community Life */}
      <ActivityFeed />

      {/* Trust & Reliability Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="bg-[#1e2130]/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                  Built for the <br />
                  Modern <span className="text-purple-400">Production</span>
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      icon: Zap,
                      title: "Real-time Staffing",
                      description: "Send 50 availability checks with one click. No more spreadsheets or manual calling."
                    },
                    {
                      icon: Sparkles,
                      title: "Vetted Excellence",
                      description: "Access our exclusive database of professionals with verified portfolios and performance history."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-[#0f1117] rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all">
                  <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Project: Ghana Chronicles
                    </div>
                    <div className="w-8" />
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="h-12 w-full bg-white/5 rounded-2xl flex items-center px-4 gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">DP</div>
                      <div className="h-2 w-32 bg-white/10 rounded-full" />
                      <div className="ml-auto px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-bold text-green-400 uppercase">Confirmed</div>
                    </div>
                    <div className="h-12 w-full bg-white/5 rounded-2xl flex items-center px-4 gap-4 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">ED</div>
                      <div className="h-2 w-48 bg-white/10 rounded-full" />
                      <div className="ml-auto px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] font-bold text-purple-400 uppercase">Pending</div>
                    </div>
                    <div className="h-12 w-full bg-white/5 rounded-2xl flex items-center px-4 gap-4">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px] font-bold text-pink-400">GA</div>
                      <div className="h-2 w-24 bg-white/10 rounded-full" />
                      <div className="ml-auto px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-bold text-green-400 uppercase">Confirmed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Level up your production.
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the network of top creative professionals and production managers in Ghana.
          </p>
          <div className="flex justify-center">
            <MainCTA isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} ICUNI Connect • Ghana's Creative Pulse.</p>
      </footer>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import {
  Users,
  FolderKanban,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { TalentHero } from '@/components/talents/TalentHero';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

// Main CTA Component
function MainCTA({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  const router = useRouter();

  if (isLoading) return <Button className="opacity-50" disabled>Loading...</Button>;

  if (isAuthenticated) {
    return (
      <Button
        size="lg"
        className="bg-[var(--accent-primary)] text-black hover:opacity-90 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all transform hover:scale-105"
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
        <ArrowRight size={18} className="ml-2" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/login">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-[var(--accent-primary)] text-black hover:opacity-90 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all transform hover:scale-105"
        >
          Get Started
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </Link>
      <Link href="/talents">
        <Button
          size="lg"
          variant="secondary"
          className="w-full sm:w-auto border-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-white"
        >
          Browse Talent
        </Button>
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  // MainCTA is now external


  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full">
        <TalentHero />
      </div>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[var(--role-camera)]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] mb-8 animate-fade-in-up">
            <Sparkles size={14} className="text-[var(--accent-primary)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">The Future of Ghana Production</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up delay-100">
            Staff Your Next Shoot <br />
            <span className="text-[var(--accent-primary)]">In Seconds.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            ICUNI Connect bridges the gap between top-tier production managers and
            Ghana&apos;s most reliable creative talent. Verified, professional, and ready to work.
          </p>

          <div className="flex justify-center animate-fade-in-up delay-300">
            <MainCTA isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]/30 animate-fade-in-up delay-500">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-6">Trusted by production teams at</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos - simplified text for now */}
              <span className="text-xl font-bold">ORBIT</span>
              <span className="text-xl font-bold">FARMHOUSE</span>
              <span className="text-xl font-bold">X AGENCY</span>
              <span className="text-xl font-bold">SOLID MULTIMEDIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-[var(--bg-elevated)]/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:border-[var(--accent-primary)]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[var(--role-camera)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} className="text-[var(--role-camera)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Roster</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Access a curated database of DPs, Gaffers, Editors, and more.
                Every talent is vetted for reliability and skill level.
              </p>
            </Card>

            <Card className="p-8 hover:border-[var(--accent-primary)]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[var(--role-hairmakeup)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderKanban size={24} className="text-[var(--role-hairmakeup)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Management</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Organize your crew into slots, track bookings, and manage budgets
                all in one intuitive dashboard.
              </p>
            </Card>

            <Card className="p-8 hover:border-[var(--accent-primary)]/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Send availability checks and booking requests directly to talent.
                Get responses faster than ever before.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Props / Split Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Why Production Managers Choose ICUNI</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">No More Phone Tag</h4>
                    <p className="text-[var(--text-secondary)]">Stop calling 20 people just to find one Gaffer available on Tuesday. Send bulk availability checks in one click.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Shield size={14} className="text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Verified Reliability</h4>
                    <p className="text-[var(--text-secondary)]">We track attendance and professionalism. Bad actors get removed, so you always get the best crew.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                      <Zap size={14} className="text-[var(--accent-primary)]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Seamless Payments</h4>
                    <p className="text-[var(--text-secondary)]">Standardized rates and clear deliverables mean no arguments about overtime or day rates.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              {/* Animated Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-primary)]/30 via-[var(--role-lighting)]/20 to-[var(--role-camera)]/30 blur-3xl rounded-[3rem] opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

              <Card className="relative p-0 overflow-hidden border-[var(--accent-primary)]/20 bg-black/40 backdrop-blur-3xl shadow-2xl rounded-2xl">
                {/* Mock Browser Header */}
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-md text-[10px] text-white/30 font-mono">
                    connect.icuni.org/projects/crew-mv-01
                  </div>
                  <div className="w-10" />
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">Casting: Music Video</h3>
                      <p className="text-[10px] text-[var(--accent-primary)] font-mono mt-0.5">EST. BUDGET: $12,500</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">
                      75% STAFFED
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Role Slots Mock */}
                    {[
                      { role: 'Director of Photography', name: 'Kojo Anim', status: 'Booked', color: 'blue' },
                      { role: 'Gaffer', name: 'Ama Serwah', status: 'Booked', color: 'yellow' },
                      { role: 'Art Director', name: 'Pending Selection', status: 'Staffing', color: 'gray' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/60`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white/90">{item.role}</div>
                            <div className="text-[10px] text-white/40">{item.name}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                          item.status === 'Booked' ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/40"
                        )}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800" />
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-black bg-[var(--accent-primary)] text-black text-[8px] font-bold flex items-center justify-center">+12</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating Accents */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent-primary)]/20 blur-3xl pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to upgrade your production?</h2>
          <div className="flex justify-center">
            <MainCTA isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </div>
  );
}

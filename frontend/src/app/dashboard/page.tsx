'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, StatCard } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Request, RequestInboxItem, ProjectSummary } from '@/lib/types';
import {
    Briefcase,
    Users,
    Mail,
    Plus,
    Loader2,
    Clock,
    AlertCircle,
    ArrowRight,
    Trophy,
    Target,
    Zap,
    ChevronRight,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const router = useRouter();
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [requests, setRequests] = useState<(Request | RequestInboxItem)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [projectsData, requestsData] = await Promise.all([
                api.projects.list(),
                api.requests.inbox().catch(() => []),
            ]);

            setProjects(projectsData || []);
            setRequests(requestsData || []);
        } catch (err: any) {
            console.error('Dashboard load error:', err);
            setError('System synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="w-16 h-16 animate-spin text-purple-500 relative z-10 opactiy-50" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white font-black text-xs uppercase tracking-[0.3em]">Connecting to ICUNI Engine</p>
                    <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 animate-loading-bar" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-32 px-4 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-[28px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Sync Offline</h3>
                <p className="text-slate-500 mb-10 leading-relaxed">The production network encountered a handshake error while verifying your session data.</p>
                <Button onClick={loadDashboardData} className="btn-gradient border-none px-12 h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-900/20">
                    Re-establish Link
                </Button>
            </div>
        );
    }

    const activeProjectList = projects.filter(p => ['staffing', 'requests_sent', 'booked', 'locked', 'shortlisted'].includes(p.status));
    const pendingRequestCount = requests.filter(r => ['sent', 'viewed'].includes(r.status)).length;
    const completedCount = projects.filter(p => p.status === 'completed').length;

    return (
        <div className="space-y-12 py-8 animate-fade-in max-w-[1600px] mx-auto">
            {/* Command Center Header */}
            <div className="relative px-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-filter backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_8px_var(--purple-500)]"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status: Optimal</span>
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                                Welcome, <span className="gradient-text">{user?.display_name ? user.display_name.split(' ')[0] : 'Commander'}</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                Production Control Center • Ghana Production Network
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <Button
                            className="h-16 px-10 rounded-3xl btn-gradient border-none font-black uppercase tracking-widest text-[10px] gap-3 shadow-[0_0_30px_rgba(139,92,246,0.3)] group"
                            onClick={() => router.push('/projects/new')}
                        >
                            <Plus size={20} className="transition-transform group-hover:rotate-90" />
                            Initialize Production
                        </Button>
                    </div>
                </div>
            </div>

            {/* Platform Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Active Missions"
                    value={activeProjectList.length.toString()}
                    icon={Target}
                    variant="purple"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    label="Talent Pipeline"
                    value={pendingRequestCount.toString()}
                    icon={Mail}
                    variant="cyan"
                    trend={{ value: 2, isPositive: true }}
                />
                <StatCard
                    label="Archived Success"
                    value={completedCount.toString()}
                    icon={Trophy}
                    variant="green"
                />
                <StatCard
                    label="Network Reach"
                    value="2.4k"
                    icon={Users}
                    variant="pink"
                    trend={{ value: 15, isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Active Productions Roster */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Briefcase size={20} className="text-purple-400" />
                            </div>
                            Production Roster
                        </h2>
                        <Link href="/projects" className="text-[10px] font-black text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group">
                            Expand Roster
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {activeProjectList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeProjectList.slice(0, 4).map(project => (
                                <div
                                    key={project.project_id}
                                    className="bg-[#1e2130] p-8 rounded-[40px] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group hover-lift active:scale-95 shadow-xl relative overflow-hidden"
                                    onClick={() => router.push(`/projects/${project.project_id}`)}
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <Zap size={64} className="text-purple-500" />
                                    </div>

                                    <div className="flex items-start justify-between mb-8 relative z-10">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">{project.title}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{project.type.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "mt-1 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shrink-0",
                                            ['staffing', 'requests_sent', 'booked'].includes(project.status)
                                                ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                : 'bg-white/5 border-white/10 text-slate-500'
                                        )}>
                                            {project.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-3">
                                                {[...Array(Math.min(4, project.lineup_count || 1))].map((_, i) => (
                                                    <div key={i} className="w-10 h-10 rounded-2xl border-4 border-[#1e2130] bg-black/40 shadow-xl overflow-hidden flex items-center justify-center">
                                                        <Users size={16} className="text-slate-700" />
                                                    </div>
                                                ))}
                                                {(project.slots_count || 0) > 4 && (
                                                    <div className="w-10 h-10 rounded-2xl border-4 border-[#1e2130] bg-purple-600 text-xs font-black flex items-center justify-center text-white shadow-xl">
                                                        +{(project.slots_count || 0) - 4}
                                                    </div>
                                                )}
                                                {(project.slots_count || 0) === 0 && (
                                                    <div className="w-10 h-10 rounded-2xl border-4 border-dashed border-white/5 flex items-center justify-center text-slate-800">
                                                        <Plus size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-black text-white">{project.lineup_count || 0}<span className="text-slate-700 mx-1">/</span>{project.slots_count || 0}</div>
                                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Team Composition</div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                <MapPin size={12} className="text-slate-800" />
                                                {project.location_city || 'Virtual Hub'}
                                            </div>
                                            <ChevronRight size={18} className="text-slate-800 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-[#1e2130] rounded-[48px] border border-white/5 border-dashed relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Briefcase className="w-16 h-16 mx-auto mb-8 text-slate-800 relative z-10" />
                            <h3 className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Zero Active Missions</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-10 font-bold uppercase tracking-widest text-[10px] relative z-10">Launch your next production to start staffing.</p>
                            <Button
                                onClick={() => router.push('/projects/new')}
                                className="h-16 px-12 rounded-3xl btn-gradient border-none font-black uppercase tracking-widest text-[10px] gap-3 shadow-lg relative z-10"
                            >
                                <Zap size={18} />
                                Initialize First Project
                            </Button>
                        </div>
                    )}
                </div>

                {/* Tactical Sidebar */}
                <div className="space-y-12">
                    {/* Operation Shortcuts */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-white px-4 uppercase tracking-tighter">Tactical Gateways</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Elite Talent Network', icon: Users, path: '/dist/talents', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                { label: 'Response Protocol', icon: Mail, path: '/dist/requests', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => router.push(item.path)}
                                    className="w-full flex items-center gap-5 p-6 rounded-3xl bg-[#1e2130] border border-white/5 hover:border-white/10 hover-lift shadow-xl text-left group transition-all"
                                >
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner group-hover:rotate-6", item.bg)}>
                                        <item.icon size={24} className={cn("transition-colors", item.color)} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-white uppercase tracking-tight">{item.label}</div>
                                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Instant Pulse</div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-800 transition-all group-hover:translate-x-1 group-hover:text-white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mission Log (Recent Activity) */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-white px-4 flex items-center gap-3 uppercase tracking-tighter">
                            <History size={20} className="text-slate-600" />
                            Mission Log
                        </h2>
                        <div className="bg-[#1e2130] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                            {requests.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {requests.slice(0, 5).map((item) => {
                                        const request = item as any;
                                        return (
                                            <div
                                                key={request.request_id}
                                                className="p-6 hover:bg-white/[0.02] transition-all cursor-pointer group relative overflow-hidden"
                                                onClick={() => router.push('/requests')}
                                            >
                                                <div className="flex items-start gap-4 relative z-10">
                                                    <div className={cn(
                                                        "mt-1.5 h-2 w-2 rounded-full shrink-0 shadow-[0_0_12px_currentColor]",
                                                        request.status === 'accepted' ? 'text-green-500' :
                                                            request.status === 'declined' ? 'text-red-500' : 'text-purple-500 animate-pulse'
                                                    )} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-white truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                                                            {request.project_title || "Network Broadcast"}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                                                                {request.role_name || request.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest shrink-0 mt-1">
                                                        {new Date(request.sent_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <Clock className="w-10 h-10 mx-auto mb-4 text-slate-800 opacity-20" />
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-relaxed"> No mission logs recorded in recent transmission cycles.</p>
                                </div>
                            )}
                            {requests.length > 0 && (
                                <Link
                                    href="/requests"
                                    className="block py-4 text-center text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] bg-black/20 hover:bg-black/40 transition-all border-t border-white/5"
                                >
                                    Access Full Log
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

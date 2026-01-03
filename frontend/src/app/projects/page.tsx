'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, SearchInput, Select, StatusBadge } from '@/components/ui';
import { formatDate, getProjectTypeLabel } from '@/lib/utils';
import type { ProjectSummary, ProjectStatus } from '@/lib/types';
import { Plus, FolderKanban, Calendar, MapPin, Loader2, ArrowRight, Target, Sparkles } from 'lucide-react';
import { ProjectManager } from '@/components/projects/ProjectManager';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'staffing', label: 'Staffing' },
    { value: 'requests_sent', label: 'Requests Sent' },
    { value: 'locked', label: 'Locked' },
    { value: 'booked', label: 'Booked' },
    { value: 'completed', label: 'Completed' },
];

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'music_video', label: 'Music Video' },
    { value: 'brand_shoot', label: 'Brand Shoot' },
    { value: 'short_film', label: 'Short Film' },
    { value: 'doc', label: 'Documentary' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Other' },
];

function getStatusColor(status: ProjectStatus): string {
    const colors: Record<ProjectStatus, string> = {
        draft: '#64748B',            // gray
        staffing: '#8B5CF6',         // purple
        requests_sent: '#06B6D4',    // cyan
        locked: '#EC4899',           // pink
        booked: '#10B981',           // green
        completed: '#94A3B8',        // slate
        cancelled: '#EF4444',        // red
    };
    return colors[status] || '#8B5CF6';
}

export default function ProjectsPage() {
    const { isAuthenticated } = useAuth();

    // Authenticated View State
    const [view, setView] = useState<'manage' | 'list'>('manage');
    const [activeProject, setActiveProject] = useState<ProjectSummary | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        async function fetchProjects() {
            try {
                setLoading(true);
                if (view === 'manage') {
                    const response = await api.projects.listByUser();
                    setProjects(response || []);
                    const active = response.filter((p: ProjectSummary) => !['completed', 'cancelled'].includes(p.status))
                        .sort((a: ProjectSummary, b: ProjectSummary) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];
                    setActiveProject(active || null);
                } else {
                    const response = await api.projects.list({ status: statusFilter, type: typeFilter });
                    setProjects(response || []);
                }
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch projects:', err);
                setError(err.message || 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [statusFilter, typeFilter, view, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="space-y-8 animate-fade-in py-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            <Sparkles size={12} />
                            Guest Mode
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Project Engine</h1>
                        <p className="text-slate-400 mt-2">
                            Design your project, estimate timelines, and shortlist talents.
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline transition-all">
                                Sign in to save your progress.
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="bg-[#1a1d29] rounded-[40px] border border-white/5 p-8">
                    <ProjectManager />
                </div>
            </div>
        );
    }

    const filteredProjects = projects.filter((project) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!project.title.toLowerCase().includes(query)) return false;
        }
        return true;
    });

    const activeProjectsList = filteredProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
    const pastProjectsList = filteredProjects.filter(p => ['completed', 'cancelled'].includes(p.status));

    if (view === 'manage') {
        return (
            <div className="space-y-8 animate-fade-in py-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            <Target size={12} />
                            Active Production
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
                        <p className="text-slate-400 mt-2">
                            Managing your current staffing workflow and project pipeline.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-6 py-3 h-auto rounded-xl gap-2"
                            onClick={() => setView('list')}
                        >
                            <FolderKanban size={18} />
                            View All Projects
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500 opacity-50" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Project Engine...</p>
                    </div>
                ) : (
                    <div className="bg-[#1a1d29]/40 backdrop-blur-xl rounded-[40px] border border-white/5 p-1">
                        <ProjectManager initialData={activeProject || undefined} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => setView('manage')}
                        className="mb-4 pl-0 text-slate-500 hover:text-purple-400 hover:bg-transparent flex items-center gap-2 group transition-all"
                    >
                        <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Command Center
                    </Button>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Project Explorer</h1>
                    <p className="text-slate-400 mt-2">Browsing your entire production history and drafted concepts.</p>
                </div>
                <Link href="/projects/new">
                    <Button className="btn-gradient border-none px-8 py-4 h-auto rounded-2xl group">
                        <Plus size={20} className="transition-transform group-hover:rotate-90" />
                        New Production
                    </Button>
                </Link>
            </div>

            {/* Elite Filters */}
            <div className="bg-[#1e2130] p-6 rounded-[24px] border border-white/5 shadow-xl flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                    <SearchInput
                        placeholder="Search for projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/40 border-white/5 focus:border-purple-500/30 transition-all rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 sm:w-44 bg-black/40 border-white/5 rounded-xl h-[48px]"
                    />
                    <Select
                        options={typeOptions}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="flex-1 sm:w-44 bg-black/40 border-white/5 rounded-xl h-[48px]"
                    />
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 opacity-20" />
                </div>
            )}

            {!loading && (
                <div className="space-y-12">
                    {/* Active Section */}
                    {activeProjectsList.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_var(--purple-500)]" />
                                Current Productions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeProjectsList.map((project) => (
                                    <Link key={project.project_id} href={`/projects/${project.project_id}`} className="group h-full">
                                        <Card className="p-8 h-full bg-[#1e2130] border-white/5 border-b-2 border-b-transparent group-hover:border-b-purple-500/50 group-hover:bg-[#252a38] transition-all hover-lift rounded-[28px] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors" />

                                            <div className="flex items-start justify-between mb-6 relative z-10">
                                                <StatusBadge status={project.status} className="shadow-sm" />
                                                {project.start_date && (
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 transition-all group-hover:border-purple-500/20 group-hover:text-slate-400">
                                                        <Calendar size={12} className="text-purple-400" />
                                                        {formatDate(project.start_date)}
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-purple-400 transition-colors">{project.title}</h3>

                                            <div className="flex items-center gap-3 text-xs text-slate-400 mb-8 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-slate-600" />
                                                    {project.location_city || "Ghana"}
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                <div className="uppercase tracking-widest text-[10px]">{getProjectTypeLabel(project.type)}</div>
                                            </div>

                                            <div className="space-y-4 relative z-10 transition-transform group-hover:translate-y-[-2px]">
                                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                                                    <span className="text-slate-500 flex items-center gap-2">
                                                        <Plus size={10} className="text-purple-400" />
                                                        Crewing Progress
                                                    </span>
                                                    <span className="text-white bg-purple-500/20 px-2 py-0.5 rounded">
                                                        {project.lineup_count} / {project.slots_count}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                                        style={{
                                                            width: `${Math.min(100, (project.lineup_count / (project.slots_count || 1)) * 100)}%`,
                                                            background: `linear-gradient(to right, ${getStatusColor(project.status)}, #8B5CF6)`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {project.pending_requests > 0 && (
                                                <div className="mt-6 flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-purple-500/5 border border-purple-500/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
                                                        {project.pending_requests} Unresolved Requests
                                                    </span>
                                                </div>
                                            )}
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Past Section */}
                    {pastProjectsList.length > 0 && (
                        <section className="pt-12">
                            <h2 className="text-xl font-bold text-slate-500 mb-6 px-2 flex items-center gap-3">
                                <Clock size={20} />
                                Completed History
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastProjectsList.map((project) => (
                                    <Link key={project.project_id} href={`/projects/${project.project_id}`}>
                                        <Card className="p-6 bg-[#1a1d29]/50 border-white/5 opacity-60 hover:opacity-100 transition-all hover:bg-[#1e2130] rounded-2xl group">
                                            <div className="flex items-start justify-between mb-4">
                                                <StatusBadge status={project.status} />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.1em]">
                                                    {formatDate(project.start_date)}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
                                            <p className="text-xs text-slate-500 mt-2">{getProjectTypeLabel(project.type)}</p>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="py-32 text-center bg-[#1a1d29] rounded-[40px] border border-white/5">
                            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5">
                                <FolderKanban size={40} className="text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No productions found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-10 text-lg">
                                {searchQuery || statusFilter || typeFilter
                                    ? "Try broadening your search or resetting your filters."
                                    : "Launch your first project to start building your elite production crew."}
                            </p>
                            <Link href="/projects/new">
                                <Button className="btn-gradient border-none px-10 py-5 h-auto rounded-2xl text-lg">
                                    <Plus size={22} />
                                    Launch New Project
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

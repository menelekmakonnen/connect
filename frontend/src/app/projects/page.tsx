'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, SearchInput, Select, StatusBadge } from '@/components/ui';
import { formatDate, getProjectTypeLabel } from '@/lib/utils';
import type { ProjectSummary, ProjectStatus } from '@/lib/types';
import { Plus, FolderKanban, Calendar, MapPin, Loader2 } from 'lucide-react';
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
        draft: 'var(--req-draft)',
        staffing: 'var(--req-sent)',
        requests_sent: 'var(--req-negotiating)',
        locked: 'var(--req-locked)',
        booked: 'var(--req-accepted)',
        completed: 'var(--text-muted)',
        cancelled: 'var(--req-declined)',
    };
    return colors[status];
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
                // Fetch user projects
                if (view === 'manage') {
                    const response = await api.projects.listByUser();
                    setProjects(response || []);
                    // Find the most recent active project
                    const active = response.filter((p: ProjectSummary) => !['completed', 'cancelled'].includes(p.status))
                        .sort((a: ProjectSummary, b: ProjectSummary) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];
                    setActiveProject(active || null);
                } else {
                    // Explorer view (list all public)
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

    // If NOT authenticated, show the Project Manager (Guest View)
    if (!isAuthenticated) {
        return (
            <div className="page-container animate-fade-in">
                <div className="mb-6">
                    <p className="text-[var(--text-secondary)]">
                        Design your project, estimate timelines, and shortlist talents.
                        <Link href="/login?message=Sign+in+to+save+your+project" className="text-[var(--accent-primary)] hover:underline ml-1">
                            Sign in to save.
                        </Link>
                    </p>
                </div>
                <ProjectManager />
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

    const activeProjects = filteredProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
    const pastProjects = filteredProjects.filter(p => ['completed', 'cancelled'].includes(p.status));

    if (view === 'manage') {
        return (
            <div className="page-container animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Project Engine</h1>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setView('list')}>
                            <FolderKanban size={18} className="mr-2" />
                            View All Projects
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[var(--accent-primary)]" />
                        <p className="text-[var(--text-secondary)]">Loading Engine...</p>
                    </div>
                ) : (
                    <ProjectManager initialData={activeProject || undefined} />
                )}
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            {/* Header */}
            <div className="section-header">
                <div>
                    <Button variant="ghost" onClick={() => setView('manage')} className="mb-2 pl-0 hover:bg-transparent hover:text-[var(--accent-primary)]">
                        ← Back to Engine
                    </Button>
                    <h1 className="text-3xl font-bold mb-1">Project Explorer</h1>
                    <Link href="/projects/new">
                        <Button className="h-12 px-6">
                            <Plus size={18} />
                            Create Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <Card className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-secondary)]">Loading projects...</p>
                </Card>
            )}

            {/* Error State */}
            {error && !loading && (
                <Card className="p-6 border-[var(--req-declined)] bg-red-900/10">
                    <p className="text-sm text-red-400">Error: {error}</p>
                </Card>
            )}

            {/* Filters */}
            {!loading && !error && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-40"
                    />
                    <Select
                        options={typeOptions}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full sm:w-40"
                    />
                </div>
            )}

            {/* Active Projects */}
            {activeProjects.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-medium mb-4">Active</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeProjects.map((project) => (
                            <Link key={project.project_id} href={`/projects/${project.project_id}`}>
                                <Card variant="interactive" className="p-6 h-full border-white/5 relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex flex-col gap-2">
                                            <StatusBadge status={project.status} />
                                        </div>
                                        {!project.start_date && <div className="text-[var(--text-muted)] text-xs">No Date</div>}
                                        {project.start_date && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] bg-white/5 px-2 py-1 rounded">
                                                <Calendar size={10} />
                                                {formatDate(project.start_date)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors">{project.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mb-4">
                                        {project.location_city && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {project.location_city}
                                            </span>
                                        )}
                                        <span>{getProjectTypeLabel(project.type)}</span>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-[var(--text-muted)]">Lineup Progress</span>
                                            <span className="font-medium">{project.lineup_count}/{project.slots_count}</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${(project.lineup_count / project.slots_count) * 100}%`,
                                                    background: getStatusColor(project.status),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {project.pending_requests > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="w-2 h-2 rounded-full bg-[var(--req-negotiating)] animate-pulse" />
                                            <span className="text-[var(--accent-primary)]">
                                                {project.pending_requests} pending response{project.pending_requests > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Past Projects */}
            {pastProjects.length > 0 && (
                <section>
                    <h2 className="text-lg font-medium mb-4 text-[var(--text-muted)]">Past</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastProjects.map((project) => (
                            <Link key={project.project_id} href={`/projects/${project.project_id}`}>
                                <Card variant="interactive" className="p-5 opacity-70 hover:opacity-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <StatusBadge status={project.status} />
                                        {project.start_date && (
                                            <span className="text-xs text-[var(--text-muted)]">
                                                {formatDate(project.start_date)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-base mb-1">{project.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                        {project.location_city && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {project.location_city}
                                            </span>
                                        )}
                                        <span>{getProjectTypeLabel(project.type)}</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                        <FolderKanban size={24} className="text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        {searchQuery || statusFilter || typeFilter
                            ? 'Try adjusting your filters'
                            : 'Create your first project to start building a lineup'}
                    </p>
                    <Link href="/projects/new">
                        <Button>
                            <Plus size={16} />
                            New Project
                        </Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}

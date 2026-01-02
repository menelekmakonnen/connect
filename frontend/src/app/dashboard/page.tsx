'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth, useAuthStore } from '@/lib/auth';
import { api } from '@/lib/api';
import { Project, Request, RequestInboxItem, ProjectSummary } from '@/lib/types';
import {
    Briefcase,
    Users,
    Mail,
    Plus,
    Loader2,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

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

            // Load projects and requests in parallel
            const [projectsData, requestsData] = await Promise.all([
                api.projects.list(),
                api.requests.inbox().catch(() => []), // Graceful fallback if endpoint not ready
            ]);

            setProjects(projectsData || []);
            setRequests(requestsData || []);
        } catch (err: any) {
            console.error('Dashboard load error:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="text-lg text-[var(--text-secondary)]">{error}</p>
                <Button onClick={loadDashboardData} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    // Calculate stats
    const activeProjects = projects.filter(p => ['staffing', 'requests_sent', 'booked', 'locked'].includes(p.status));
    const pendingRequests = requests.filter(r => ['sent', 'viewed'].includes(r.status));

    return (
        <div className="space-y-8 pt-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back{user?.display_name ? `, ${user.display_name}` : ''}!
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Here's what's happening with your projects
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">Active Projects</p>
                            <p className="text-3xl font-bold">{activeProjects.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[var(--role-camera)]/20 flex items-center justify-center">
                            <Briefcase className="text-[var(--role-camera)]" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">Total Projects</p>
                            <p className="text-3xl font-bold">{projects.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[var(--accent-glow)] flex items-center justify-center">
                            <CheckCircle2 className="text-[var(--accent-primary)]" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">Pending Requests</p>
                            <p className="text-3xl font-bold">{pendingRequests.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[var(--role-hairmakeup)]/20 flex items-center justify-center">
                            <Mail className="text-[var(--role-hairmakeup)]" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        className="justify-start h-auto py-4"
                        onClick={() => router.push('/projects/new')}
                    >
                        <Plus size={20} />
                        <div className="text-left">
                            <div className="font-semibold">New Project</div>
                            <div className="text-xs opacity-80">Start planning a production</div>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        className="justify-start h-auto py-4"
                        onClick={() => router.push('/talents')}
                    >
                        <Users size={20} />
                        <div className="text-left">
                            <div className="font-semibold">Browse Talents</div>
                            <div className="text-xs opacity-80">Find talent for your crew</div>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        className="justify-start h-auto py-4"
                        onClick={() => router.push('/requests')}
                    >
                        <Mail size={20} />
                        <div className="text-left">
                            <div className="font-semibold">View Requests</div>
                            <div className="text-xs opacity-80">Manage your inbox</div>
                        </div>
                    </Button>
                </div>
            </Card>

            {/* Active Projects */}
            {activeProjects.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Active Projects</h2>
                        <Link href="/projects">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeProjects.slice(0, 4).map(project => (
                            <Card
                                key={project.project_id}
                                className="p-4 hover:border-[var(--accent-primary)] cursor-pointer transition-all"
                                onClick={() => router.push(`/projects/${project.project_id}`)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold">{project.title}</h3>
                                    <span className={`
                                        px-2 py-1 rounded text-xs
                                        ${['staffing', 'requests_sent', 'booked'].includes(project.status) ? 'bg-green-500/20 text-green-400' : ''}
                                        ${project.status === 'draft' ? 'bg-blue-500/20 text-blue-400' : ''}
                                    `}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                    {project.location_city} • {project.type}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                    <span>{project.slots_count || 0} roles</span>
                                    <span>{project.lineup_count || 0} booked</span>
                                    {(project.pending_requests || 0) > 0 && (
                                        <span className="text-[var(--accent-primary)]">
                                            {project.pending_requests} pending
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Requests */}
            {requests.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Requests</h2>
                        <Link href="/requests">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>

                    <Card className="divide-y divide-[var(--border-subtle)]">
                        {requests.slice(0, 5).map((item) => {
                            const request = item as Request & RequestInboxItem;
                            return (
                                <div
                                    key={request.request_id}
                                    className="p-4 hover:bg-[var(--bg-hover)] cursor-pointer transition-all"
                                    onClick={() => router.push('/requests')}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium mb-1">{request.project_title || request.project_id}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {request.role_name || 'View Details'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`
                                                px-2 py-1 rounded text-xs
                                                ${request.status === 'accepted' ? 'bg-green-500/20 text-green-400' : ''}
                                                ${['sent', 'viewed'].includes(request.status) ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                                ${['declined', 'cancelled'].includes(request.status) ? 'bg-red-500/20 text-red-400' : ''}
                                            `}>
                                                {request.status}
                                            </span>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                                <Clock size={12} className="inline mr-1" />
                                                {new Date(request.sent_at || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </div>
            )}

            {/* Empty State */}
            {projects.length === 0 && (
                <Card className="p-12 text-center">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                    <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Get started by creating your first project
                    </p>
                    <Button onClick={() => router.push('/projects/new')}>
                        <Plus size={20} />
                        Create Project
                    </Button>
                </Card>
            )}
        </div>
    );
}

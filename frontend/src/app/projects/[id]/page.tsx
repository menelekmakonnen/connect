'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Avatar, StatusBadge, RoleBadge, AvailabilityBadge } from '@/components/ui';
import { formatDate, formatCurrency, getProjectTypeLabel, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Project, RoleSlot } from '@/lib/types';
import { AddToLineupModal } from '@/components/projects/AddToLineupModal';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Plus,
    Send,
    FileText,
    MoreHorizontal,
    ChevronRight,
    UserPlus,
    X,
    Check,
    Clock,
    AlertCircle,
    Loader2
} from 'lucide-react';

function getLineupStatusInfo(status: string) {
    const info: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
        shortlisted: { icon: <Clock size={12} />, color: 'var(--req-draft)', label: 'Shortlisted' },
        invited: { icon: <Send size={12} />, color: 'var(--req-sent)', label: 'Invited' },
        accepted: { icon: <Check size={12} />, color: 'var(--req-accepted)', label: 'On Hold' },
        declined: { icon: <X size={12} />, color: 'var(--req-declined)', label: 'Declined' },
        negotiating: { icon: <AlertCircle size={12} />, color: 'var(--req-negotiating)', label: 'Negotiating' },
    };
    return info[status] || info.shortlisted;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLineupModalOpen, setIsLineupModalOpen] = useState(false);
    const [selectedSlotForLineup, setSelectedSlotForLineup] = useState<RoleSlot | null>(null);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.projects.getById(id);
            setProject(data);
        } catch (err) {
            console.error('Failed to load project:', err);
            setError('Project not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = (slot: RoleSlot) => {
        setSelectedSlotForLineup(slot);
        setIsLineupModalOpen(true);
    };

    const handleTalentAdded = () => {
        loadProject(); // Refresh data
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
                <p className="text-[var(--text-secondary)] mb-6">{error || 'This project doesn\'t exist'}</p>
                <Link href="/projects">
                    <Button>
                        <ArrowLeft size={16} />
                        Back to Projects
                    </Button>
                </Link>
            </div>
        );
    }

    // Role Slots safety check
    const roleSlots = project.role_slots || [];

    const filledCount = roleSlots.filter((s: RoleSlot) => s.status === 'filled').length;
    const totalSlots = roleSlots.length;
    const pendingResponses = roleSlots.flatMap((s: RoleSlot) => s.assigned || []).filter((a: any) => a.lineup_status === 'invited').length;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                <div className="page-container py-6">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4">
                        <ArrowLeft size={16} />
                        Back to Projects
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-semibold">{project.title}</h1>
                                <StatusBadge status={project.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {formatDate(project.start_date || '')}
                                    {project.end_date && project.end_date !== project.start_date && (
                                        <> - {formatDate(project.end_date)}</>
                                    )}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    {project.location_city}
                                </span>
                                <span>{getProjectTypeLabel(project.type)}</span>
                                {project.client_name && (
                                    <span className="text-[var(--text-secondary)]">• {project.client_name}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="secondary">
                                <FileText size={16} />
                                Deal Memos
                            </Button>
                            <Button disabled={pendingResponses === 0}>
                                <Send size={16} />
                                Send Holds ({pendingResponses})
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Lineup Board */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress */}
                        {totalSlots > 0 && (
                            <Card className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-medium">Lineup Progress</h2>
                                    <span className="text-sm font-medium">{filledCount}/{totalSlots} roles filled</span>
                                </div>
                                <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-[var(--req-accepted)] transition-all"
                                        style={{ width: `${(filledCount / totalSlots) * 100}%` }}
                                    />
                                </div>
                                {pendingResponses > 0 && (
                                    <p className="mt-3 text-sm text-[var(--text-muted)] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[var(--req-negotiating)] animate-pulse" />
                                        {pendingResponses} pending response{pendingResponses > 1 ? 's' : ''}
                                    </p>
                                )}
                            </Card>
                        )}

                        {/* Role Slots */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium">Role Slots</h2>
                                <Button variant="secondary" size="sm">
                                    <Plus size={14} />
                                    Add Role
                                </Button>
                            </div>

                            {totalSlots === 0 ? (
                                <Card className="p-8 text-center text-[var(--text-muted)]">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="mb-4">No roles added yet</p>
                                    <Button variant="secondary" size="sm">Add First Role</Button>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {roleSlots.map((slot: RoleSlot) => (
                                        <Card
                                            key={slot.slot_id}
                                            className={cn(
                                                'p-4 cursor-pointer transition-all',
                                                selectedSlot === slot.slot_id && 'ring-1 ring-[var(--accent-primary)]'
                                            )}
                                            onClick={() => setSelectedSlot(selectedSlot === slot.slot_id ? null : slot.slot_id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Role Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <RoleBadge
                                                            name={slot.role_name}
                                                            category={slot.role_category as any}
                                                        />
                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            ×{slot.qty}
                                                        </span>
                                                        {slot.target_fee && (
                                                            <span className="text-xs text-[var(--accent-primary)]">
                                                                {formatCurrency(slot.target_fee)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {slot.requirements && (
                                                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                                                            {slot.requirements}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Assigned Talent */}
                                                <div className="flex items-center gap-2">
                                                    {(slot.assigned || []).length > 0 ? (
                                                        <>
                                                            <div className="flex -space-x-2">
                                                                {(slot.assigned || []).map((talent: any) => {
                                                                    const statusInfo = getLineupStatusInfo(talent.lineup_status);
                                                                    return (
                                                                        <div key={talent.talent_id} className="relative">
                                                                            <Avatar
                                                                                src={talent.photo}
                                                                                alt={talent.name}
                                                                                size="sm"
                                                                                className="ring-2 ring-[var(--bg-glass)]"
                                                                            />
                                                                            <div
                                                                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center border border-[var(--bg-glass)]"
                                                                                style={{ background: statusInfo.color }}
                                                                            >
                                                                                {/* Icon too small here, just color dot */}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {(slot.assigned || []).length < slot.qty && (
                                                                <button
                                                                    aria-label="Add Talent"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddClick(slot);
                                                                    }}
                                                                    className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddClick(slot);
                                                            }}
                                                        >
                                                            <UserPlus size={14} />
                                                            Find Talent
                                                        </Button>
                                                    )}
                                                </div>

                                                <ChevronRight
                                                    size={16}
                                                    className={cn(
                                                        'text-[var(--text-muted)] transition-transform',
                                                        selectedSlot === slot.slot_id && 'rotate-90'
                                                    )}
                                                />
                                            </div>

                                            {/* Expanded Details */}
                                            {selectedSlot === slot.slot_id && (slot.assigned || []).length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] animate-fade-in">
                                                    <div className="space-y-2">
                                                        {(slot.assigned || []).map((talent: any) => {
                                                            const statusInfo = getLineupStatusInfo(talent.lineup_status);
                                                            return (
                                                                <div key={talent.talent_id} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-elevated)]">
                                                                    <Avatar src={talent.photo} alt={talent.name} />
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{talent.name}</p>
                                                                        <p
                                                                            className="text-xs flex items-center gap-1"
                                                                            style={{ color: statusInfo.color }}
                                                                        >
                                                                            {statusInfo.icon}
                                                                            {statusInfo.label}
                                                                        </p>
                                                                    </div>
                                                                    <Button variant="ghost" size="sm" aria-label="More options">
                                                                        <MoreHorizontal size={14} />
                                                                    </Button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Brief */}
                        <Card className="p-5">
                            <h3 className="font-medium mb-3">Brief</h3>
                            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                                {project.brief || 'No brief added yet.'}
                            </p>
                        </Card>

                        {/* Budget */}
                        <Card className="p-5">
                            <h3 className="font-medium mb-3">Budget</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--text-muted)]">Tier</span>
                                    <span className="capitalize font-medium">{project.budget_tier}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--text-muted)]">Estimated Total</span>
                                    <span className="font-medium text-[var(--accent-primary)]">
                                        {formatCurrency(roleSlots.reduce((sum: number, s: RoleSlot) => sum + (s.target_fee || 0), 0))}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-5">
                            <h3 className="font-medium mb-3">Actions</h3>
                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start">
                                    <FileText size={16} />
                                    Generate Deal Memos
                                </Button>
                                <Button variant="secondary" className="w-full justify-start">
                                    <Users size={16} />
                                    Export One-Sheet
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <AddToLineupModal
                isOpen={isLineupModalOpen}
                onClose={() => setIsLineupModalOpen(false)}
                projectId={id}
                roleSlot={selectedSlotForLineup}
                onAdded={handleTalentAdded}
            />
        </div>
    );
}

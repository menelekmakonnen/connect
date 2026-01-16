'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Avatar, StatusBadge, RoleBadge } from '@/components/ui';
import { formatDate, formatCurrency, getProjectTypeLabel, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Project, RoleSlot } from '@/lib/types';
import { AddToLineupModal } from '@/components/projects/AddToLineupModal';
import { ProductionTimeline, DEFAULT_PHASES } from '@/components/projects/ProductionTimeline';
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
    Loader2,
    Briefcase,
    Zap,
    Target,
    Layers,
    Coins
} from 'lucide-react';

function getLineupStatusInfo(status: string) {
    const info: Record<string, { icon: React.ReactNode; color: string; label: string; bg: string }> = {
        shortlisted: { icon: <Clock size={12} />, color: '#94A3B8', label: 'Shortlisted', bg: 'rgba(148, 163, 184, 0.1)' },
        invited: { icon: <Send size={12} />, color: '#06B6D4', label: 'Invited', bg: 'rgba(6, 182, 212, 0.1)' },
        accepted: { icon: <Check size={12} />, color: '#10B981', label: 'On Hold', bg: 'rgba(16, 185, 129, 0.1)' },
        declined: { icon: <X size={12} />, color: '#EF4444', label: 'Declined', bg: 'rgba(239, 68, 68, 0.1)' },
        negotiating: { icon: <AlertCircle size={12} />, color: '#F59E0B', label: 'Negotiating', bg: 'rgba(245, 158, 11, 0.1)' },
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
        loadProject();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 opacity-50" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Production Data...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="text-center py-32 px-4 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Access Denied</h2>
                <p className="text-slate-400 mb-10 leading-relaxed">{error || "The project you're looking for has been archived or does not exist."}</p>
                <Link href="/projects">
                    <Button className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 h-auto rounded-2xl">
                        <ArrowLeft size={18} className="mr-2" />
                        Return to Explorer
                    </Button>
                </Link>
            </div>
        );
    }

    const roleSlots = project.role_slots || [];
    const filledCount = roleSlots.filter((s: RoleSlot) => s.status === 'filled').length;
    const totalSlots = roleSlots.length;
    const pendingResponses = roleSlots.flatMap((s: RoleSlot) => s.assigned || []).filter((a: any) => a.lineup_status === 'invited').length;

    return (
        <div className="animate-fade-in space-y-8 pb-20">
            {/* Header / Hero Area */}
            <div className="relative overflow-hidden rounded-[40px] bg-[#1a1d29] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="p-8 md:p-12 relative z-10">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 mb-10 transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Explorer
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <StatusBadge status={project.status} className="shadow-lg" />
                                <div className="h-1 w-1 rounded-full bg-slate-800" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg">
                                    {getProjectTypeLabel(project.type)}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                                {project.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-bold">
                                <div className="flex items-center gap-2 bg-black/20 p-2.5 pr-4 rounded-xl border border-white/5">
                                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Calendar size={16} className="text-purple-400" />
                                    </div>
                                    <span>
                                        {formatDate(project.start_date || '')}
                                        {project.end_date && project.end_date !== project.start_date && (
                                            <span className="text-slate-600 mx-2">/</span>
                                        )}
                                        {project.end_date && project.end_date !== project.start_date && (
                                            formatDate(project.end_date)
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 bg-black/20 p-2.5 pr-4 rounded-xl border border-white/5">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <MapPin size={16} className="text-cyan-400" />
                                    </div>
                                    <span>{project.location_city || 'Location Pending'}</span>
                                </div>

                                {project.client_name && (
                                    <div className="flex items-center gap-2 bg-black/20 p-2.5 pr-4 rounded-xl border border-white/5">
                                        <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                            <Briefcase size={16} className="text-pink-400" />
                                        </div>
                                        <span>{project.client_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 shrink-0">
                            <Button variant="secondary" className="h-14 px-8 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 py-4 h-auto font-bold gap-3 group">
                                <FileText size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                                Deal Memos
                            </Button>
                            <Button className="h-14 px-8 rounded-2xl btn-gradient border-none py-4 h-auto font-black shadow-lg shadow-purple-900/20 group" disabled={pendingResponses === 0}>
                                <Send size={20} className="transition-transform group-hover:rotate-12" />
                                Reach Out ({pendingResponses})
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content - Lineup Board */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Progress Analytics Card */}
                    {totalSlots > 0 && (
                        <Card className="p-8 bg-[#1e2130] border-white/5 rounded-[32px] shadow-xl relative overflow-hidden group/board">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/board:opacity-10 transition-opacity">
                                <Target size={120} />
                            </div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Zap size={20} className="text-purple-400" />
                                        Lineup Board
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-8">Real-time Crewing progress</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-white tracking-tight">{filledCount}<span className="text-slate-700 mx-1">/</span>{totalSlots}</div>
                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Confirmed Talent</div>
                                </div>
                            </div>

                            <div className="relative h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-1000 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                    style={{ width: `${(filledCount / totalSlots) * 100}%` }}
                                />
                            </div>

                            <div className="mt-8 flex flex-wrap gap-8">
                                <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-black/20 border border-white/5">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                        <Layers size={18} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-white">{totalSlots}</div>
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.15em]">Total Roles</div>
                                    </div>
                                </div>

                                {pendingResponses > 0 && (
                                    <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                            <Send size={18} className="text-cyan-400 animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-cyan-400">{pendingResponses}</div>
                                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.15em]">Waiting for Talent</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Role Slots List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                                <Users size={20} className="text-slate-400" />
                                Search Role Slots
                            </h2>
                            <Button variant="secondary" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl gap-2 font-bold text-xs" size="sm">
                                <Plus size={16} />
                                New Role
                            </Button>
                        </div>

                        {totalSlots === 0 ? (
                            <div className="py-24 text-center bg-[#1e2130] rounded-[32px] border border-white/5">
                                <Users className="w-16 h-16 mx-auto mb-6 text-slate-700" />
                                <h3 className="text-xl font-bold text-white mb-2">No roles defined</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Define your crew requirements to start building a team.</p>
                                <Button className="btn-gradient border-none px-8 py-4 h-auto rounded-2xl font-bold">Add Project Roles</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {roleSlots.map((slot: RoleSlot) => (
                                    <Card
                                        key={slot.slot_id}
                                        className={cn(
                                            'bg-[#1e2130] border-white/5 rounded-3xl p-6 transition-all hover:bg-[#252a38] hover-lift group/slot',
                                            selectedSlot === slot.slot_id && 'bg-[#252a38] ring-1 ring-purple-500/30 shadow-2xl'
                                        )}
                                        onClick={() => setSelectedSlot(selectedSlot === slot.slot_id ? null : slot.slot_id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                            {/* Role Info */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <RoleBadge
                                                        name={slot.role_name}
                                                        category={slot.role_category as any}
                                                        className="px-3 py-1.5 rounded-lg text-[10px]"
                                                    />
                                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">
                                                        ×{slot.qty} SLOTS
                                                    </span>
                                                    {slot.target_fee && (
                                                        <span className="text-xs font-black text-purple-400/80 bg-purple-500/5 px-2 py-1 rounded">
                                                            {formatCurrency(slot.target_fee)}
                                                        </span>
                                                    )}
                                                </div>
                                                {slot.requirements && (
                                                    <p className="text-xs text-slate-500 font-medium line-clamp-1 group-hover/slot:text-slate-400 transition-colors">
                                                        {slot.requirements}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Assigned Talent Visualization */}
                                            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5">
                                                <div className="flex items-center gap-2">
                                                    {(slot.assigned || []).length > 0 ? (
                                                        <div className="flex -space-x-3 group/avatars">
                                                            {(slot.assigned || []).map((talent: any) => (
                                                                <div key={talent.talent_id} className="relative group/avatar">
                                                                    <Avatar
                                                                        src={talent.photo}
                                                                        alt={talent.name}
                                                                        className="w-10 h-10 ring-4 ring-[#1e2130] group-hover/slot:ring-[#252a38] transition-all group-hover/avatar:scale-110 group-hover/avatar:z-10"
                                                                    />
                                                                    <div
                                                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1e2130] group-hover/slot:border-[#252a38] transition-colors"
                                                                        style={{ background: getLineupStatusInfo(talent.lineup_status).color }}
                                                                    />
                                                                </div>
                                                            ))}
                                                            {(slot.assigned || []).length < slot.qty && (
                                                                <button
                                                                    aria-label="Add Talent"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddClick(slot);
                                                                    }}
                                                                    className="w-10 h-10 rounded-full bg-black/40 border-2 border-dashed border-white/5 flex items-center justify-center text-slate-600 hover:border-purple-500/50 hover:text-purple-400 transition-all z-0"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-10 px-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 font-bold text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddClick(slot);
                                                            }}
                                                        >
                                                            <UserPlus size={16} className="mr-2" />
                                                            Find Crew
                                                        </Button>
                                                    )}
                                                </div>

                                                <ChevronRight
                                                    size={20}
                                                    className={cn(
                                                        'text-slate-700 transition-all group-hover/slot:text-slate-400',
                                                        selectedSlot === slot.slot_id && 'rotate-90 text-purple-500'
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Details - Talent Roster */}
                                        {selectedSlot === slot.slot_id && (slot.assigned || []).length > 0 && (
                                            <div className="mt-8 pt-8 border-t border-white/5 animate-slide-in-up">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {(slot.assigned || []).map((talent: any) => {
                                                        const statusInfo = getLineupStatusInfo(talent.lineup_status);
                                                        return (
                                                            <div key={talent.talent_id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-purple-500/20 transition-all group/talitem cursor-default">
                                                                <Avatar src={talent.photo} alt={talent.name} className="w-12 h-12 rounded-xl" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-white text-sm truncate uppercase tracking-tight">{talent.name}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: statusInfo.color }} />
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                                            {statusInfo.label}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-700 hover:text-white hover:bg-white/5 rounded-xl">
                                                                    <MoreHorizontal size={18} />
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
                <div className="space-y-8">
                    {/* Project Brief */}
                    <Card className="p-8 bg-[#1e2130] border-white/5 rounded-[32px] shadow-xl">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <FileText size={18} className="text-purple-400" />
                            Production Brief
                        </h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed whitespace-pre-line pl-1 border-l-2 border-purple-500/20">
                            {project.brief || 'Our team is still finalizing the project specifics and creative requirements for this production.'}
                        </p>
                    </Card>

                    {/* Funding & Finance */}
                    <Card className="p-8 bg-[#1e2130] border-white/5 rounded-[32px] shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-2xl rounded-full" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <Coins size={18} className="text-pink-400" />
                            Financial Deck
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 shadow-inner">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Budget Tier</span>
                                <span className="text-sm font-black text-white uppercase tracking-wider px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                                    {project.budget_tier || 'Mid'}
                                </span>
                            </div>
                            <div className="space-y-1 px-1">
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Estimated Talent Allocation</div>
                                <div className="text-3xl font-black text-white tracking-tighter shrink-0 flex items-end gap-1">
                                    {formatCurrency(roleSlots.reduce((sum: number, s: RoleSlot) => sum + (s.target_fee || 0), 0))}
                                    <span className="text-xs text-slate-700 font-bold mb-1.5 uppercase tracking-widest">GHS</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Operational Actions */}
                    <Card className="p-8 bg-black/20 border-white/5 border-dashed border-2 rounded-[32px]">
                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 text-center">Production Toolkit</h3>
                        <div className="space-y-3">
                            <Button variant="secondary" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 group px-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <FileText size={16} className="text-slate-500 group-hover:text-purple-400" />
                                    </div>
                                    <span className="font-bold text-sm">One-Sheet Export</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-800" />
                            </Button>

                            <Button variant="secondary" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 group px-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                        <Users size={16} className="text-slate-500 group-hover:text-cyan-400" />
                                    </div>
                                    <span className="font-bold text-sm">Notify Whole Crew</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-800" />
                            </Button>
                        </div>
                    </Card>
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

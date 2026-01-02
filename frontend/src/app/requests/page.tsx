'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, StatusBadge } from '@/components/ui';
import { formatDate, formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth, useAuthStore } from '@/lib/auth';

// Types imported but not strictly used due to 'any' cast, keeping RequestStatus if needed or removing all if unused.
// Checking if RequestStatus is used... likely not if request is any.
// Let's remove the whole line if possible, or just keep what's used.
// View file showed: import type { Request, RequestStatus, RequestInboxItem } from '@/lib/types';
// I'll replace it with empty string or just the used ones.
// I'll check if RequestStatus is used. It's likely not.
// So I'll remove the line.
import {
    Inbox,
    Send,
    Check,
    X,
    Calendar,
    ArrowRight,
    Loader2,
    AlertCircle,
    Briefcase
} from 'lucide-react';

type ViewMode = 'inbox' | 'sent';

export default function RequestsPage() {
    const { isAuthenticated, token } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('inbox');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        if (!isAuthenticated || !token) return; // Wait for token
        if (viewMode === 'inbox') {
            loadInbox();
        } else {
            loadSent();
        }
    }, [viewMode, isAuthenticated, token]);

    const loadInbox = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.requests.inbox();
            setRequests(data);
        } catch (err: any) {
            console.error('Failed to load requests:', err);
            setError('Failed to load your inbox. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadSent = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.requests.sent();
            setRequests(data);
        } catch (err: any) {
            console.error('Failed to load sent requests:', err);
            setError('Failed to load sent requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (requestId: string, status: 'accepted' | 'declined') => {
        try {
            setProcessingId(requestId);
            await api.requests.respond(requestId, { status });

            // Optimistic update
            setRequests(prev => prev.map(req =>
                req.request_id === requestId
                    ? { ...req, status }
                    : req
            ));
        } catch (err) {
            console.error('Failed to respond:', err);
            // In a real app, show a toast notification here
        } finally {
            setProcessingId(null);
        }
    };

    // For demo/MVP, assuming current user is Talent if viewing inbox
    const isTalent = viewMode === 'inbox';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            {/* Header */}
            <div className="section-header">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Requests</h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {isTalent ? 'Booking requests from productions' : 'Track your sent requests'}
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 p-1 rounded-lg bg-[var(--bg-elevated)]">
                    <button
                        onClick={() => setViewMode('inbox')}
                        className={cn(
                            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                            viewMode === 'inbox'
                                ? 'bg-[var(--accent-primary)] text-black'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                    >
                        <Inbox size={14} className="inline mr-1.5" />
                        Inbox
                    </button>
                    <button
                        onClick={() => setViewMode('sent')}
                        className={cn(
                            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                            viewMode === 'sent'
                                ? 'bg-[var(--accent-primary)] text-black'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                    >
                        <Send size={14} className="inline mr-1.5" />
                        Sent
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Talent Inbox View */}
            {isTalent && (
                <div className="space-y-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <Card key={request.request_id} className="p-0 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg">{request.project_id}</h3>
                                                <StatusBadge status={request.status} />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {formatDate(request.created_at)} {/* Using created_at as sent time for now */}
                                                </span>
                                                {/* <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {request.location_city}
                                                </span> */}
                                                {/* <span>{getProjectTypeLabel(request.project_type)}</span> */}
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                {/* <div>
                                                    <p className="text-xs text-[var(--text-muted)] mb-1">Role</p>
                                                    <RoleBadge name={request.role_name} category="HairMakeup" />
                                                </div> */}
                                                {/* <div>
                                                    <p className="text-xs text-[var(--text-muted)] mb-1">Offer</p>
                                                    <p className="font-semibold text-[var(--accent-primary)]">
                                                        {formatCurrency(request.offer_fee!, request.currency)}
                                                    </p>
                                                </div> */}
                                                <div>
                                                    <p className="text-xs text-[var(--text-muted)] mb-1">Message</p>
                                                    <p className="text-sm">{request.message || 'No message included'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {request.status !== 'accepted' && request.status !== 'declined' && (
                                            <div className="flex flex-col gap-2 md:w-48">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => handleRespond(request.request_id, 'accepted')}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === request.request_id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Check size={16} />
                                                            Accept Hold
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full text-[var(--req-declined)]"
                                                    onClick={() => handleRespond(request.request_id, 'declined')}
                                                    disabled={!!processingId}
                                                >
                                                    <X size={16} />
                                                    Decline
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-muted)]">
                                        Received {formatRelativeTime(request.created_at)}
                                    </span>
                                    <Button variant="ghost" size="sm">
                                        View Full Details
                                        <ArrowRight size={12} />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <Inbox size={24} className="text-[var(--text-muted)]" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                When productions send you booking requests, they&apos;ll appear here.
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Sent View */}
            {!isTalent && (
                <div className="space-y-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <Card key={request.request_id} className="p-0 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg">{request.talent_name}</h3>
                                                <StatusBadge status={request.status} />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    Sent {formatDate(request.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Briefcase size={14} />
                                                    {request.project_title} • {request.role_name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mb-2">
                                                <div>
                                                    <p className="text-xs text-[var(--text-muted)] mb-1">Offer</p>
                                                    <p className="font-semibold text-[var(--accent-primary)]">
                                                        {formatCurrency(request.offer_fee!, request.currency)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--text-muted)] mb-1">Message</p>
                                                    <p className="text-sm line-clamp-1">{request.message || 'No message included'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                                    <span className="text-xs text-[var(--text-muted)]">
                                        Updated {formatRelativeTime(request.updated_at || request.created_at)}
                                    </span>
                                    <Link href={`/projects/${request.project_id}`}>
                                        <Button variant="ghost" size="sm">
                                            View Project
                                            <ArrowRight size={12} />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-12 text-center">
                            <Send className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                            <h3 className="text-lg font-medium mb-2">No sent requests</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Requests you send to talent will appear here.
                            </p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

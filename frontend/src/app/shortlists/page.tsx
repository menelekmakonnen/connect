'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, VerificationBadge, AvailabilityBadge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Talent } from '@/lib/types';
import {
    Bookmark,
    Plus,
    Users,
    Trash2,
    Share2,
    UserPlus,
    Loader2
} from 'lucide-react';

interface Shortlist {
    id: string;
    name: string;
    talent_count: number;
    talents: string[]; // Array of Talent IDs
}

export default function ShortlistsPage() {
    const [shortlists, setShortlists] = useState<Shortlist[]>([]);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedListTalents, setSelectedListTalents] = useState<Talent[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListName, setNewListName] = useState('');

    // Fetch shortlists on mount
    useEffect(() => {
        loadShortlists();
    }, []);

    const loadShortlists = async () => {
        try {
            setLoading(true);
            const data = await api.shortlists.list();
            setShortlists(data);
            if (data.length > 0 && !selectedListId) {
                // Optionally select the first one, or leave null
            }
        } catch (error) {
            console.error('Failed to load shortlists', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch details when selection changes
    useEffect(() => {
        if (selectedListId) {
            loadListDetails(selectedListId);
        } else {
            setSelectedListTalents([]);
        }
    }, [selectedListId, shortlists]); // Depend on shortlists in case they update

    const loadListDetails = async (listId: string) => {
        const list = shortlists.find(l => l.id === listId);
        if (!list || list.talents.length === 0) {
            setSelectedListTalents([]);
            return;
        }

        try {
            setLoadingDetails(true);
            // Parallel fetch details for all talents in the list
            // Optimization: Could create a batch fetch endpoint later
            const promises = list.talents.map(id => api.talents.getById(id));
            const talents = await Promise.all(promises);
            setSelectedListTalents(talents.filter(t => !!t)); // Filter out any nulls
        } catch (error) {
            console.error('Failed to load talent details', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        try {
            await api.shortlists.create(newListName);
            setNewListName('');
            setShowCreateModal(false);
            loadShortlists();
        } catch (error) {
            console.error('Failed to create list', error);
        }
    };

    const handleDeleteList = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shortlist?')) return;
        try {
            await api.shortlists.delete(id);
            if (selectedListId === id) setSelectedListId(null);
            loadShortlists();
        } catch (error) {
            console.error('Failed to delete list', error);
        }
    };

    const handleRemoveTalent = async (talentId: string) => {
        if (!selectedListId) return;
        try {
            await api.shortlists.removeTalent(selectedListId, talentId);
            // Refresh local state without full reload if possible, or just reload
            // Quick local update:
            const updatedShortlists = shortlists.map(list => {
                if (list.id === selectedListId) {
                    return { ...list, talents: list.talents.filter(id => id !== talentId), talent_count: list.talent_count - 1 };
                }
                return list;
            });
            setShortlists(updatedShortlists);
            // Details update handled by effect or manual update
            setSelectedListTalents(prev => prev.filter(t => t.talent_id !== talentId));
        } catch (error) {
            console.error('Failed to remove talent', error);
        }
    }

    const selectedList = shortlists.find(l => l.id === selectedListId);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in relative">
            {/* Simple Create Modal Overlay */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-semibold mb-4">Create New Shortlist</h3>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Shortlist Name (e.g. 'Wedding crew')"
                            className="w-full p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] mb-4 outline-none focus:border-[var(--accent-primary)]"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                            <Button onClick={handleCreateList} disabled={!newListName.trim()}>Create</Button>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Shortlists Sidebar */}
                <div className="lg:col-span-1">
                    <div className="section-header">
                        <h1 className="text-2xl font-semibold">Shortlists</h1>
                        <Button size="sm" onClick={() => setShowCreateModal(true)}>
                            <Plus size={14} />
                            New
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {shortlists.map((list) => (
                            <div key={list.id} className="group relative">
                                <Card
                                    variant="interactive"
                                    className={cn(
                                        'p-4',
                                        selectedListId === list.id && 'ring-1 ring-[var(--accent-primary)]'
                                    )}
                                    onClick={() => setSelectedListId(list.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Bookmark size={16} className={cn(selectedListId === list.id ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]")} />
                                            <h3 className="font-medium">{list.name}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {/* Preview Avatars - placeholder or just simple circles for now as we don't have images in list view */}
                                        <div className="flex -space-x-2">
                                            {list.talents.slice(0, 3).map((id, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] ring-2 ring-[var(--bg-glass)] flex items-center justify-center text-[10px] text-[var(--text-muted)]">
                                                    ?
                                                </div>
                                            ))}
                                            {list.talent_count > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] ring-2 ring-[var(--bg-glass)] flex items-center justify-center text-xs font-medium text-[var(--text-muted)]">
                                                    +{list.talent_count - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {list.talent_count} talent
                                        </span>
                                    </div>
                                </Card>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                                    className="absolute top-4 right-4 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                    title="Delete shortlist"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Empty State */}
                        {shortlists.length === 0 && (
                            <Card className="p-8 text-center">
                                <Bookmark size={24} className="mx-auto mb-3 text-[var(--text-muted)]" />
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Create shortlists to organize your favorite talent
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Shortlist Detail */}
                <div className="lg:col-span-2">
                    {selectedList ? (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">{selectedList.name}</h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {selectedList.talent_count} talent saved
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm">
                                        <Share2 size={14} />
                                        Share
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        <UserPlus size={14} />
                                        Add to Project
                                    </Button>
                                </div>
                            </div>

                            {loadingDetails ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-[var(--text-muted)]" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedListTalents.map((talent) => (
                                        <Card key={talent.talent_id} className="p-4">
                                            <div className="flex items-center gap-4">
                                                <Link href={`/talents/${talent.talent_id}`}>
                                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[var(--bg-muted)]">
                                                        {talent.profile_photo_url ? (
                                                            <img
                                                                src={talent.profile_photo_url}
                                                                alt={talent.display_name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                                                <Users size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Link href={`/talents/${talent.talent_id}`}>
                                                            <h3 className="font-medium hover:text-[var(--accent-primary)] transition-colors">
                                                                {talent.display_name}
                                                            </h3>
                                                        </Link>
                                                        <VerificationBadge level={talent.verification_level} showLabel={false} />
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-1">{talent.headline || talent.bio}</p>
                                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                                        <span>{talent.city}</span>
                                                        <AvailabilityBadge status={talent.availability_status} showLabel />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link href={`/talents/${talent.talent_id}`}>
                                                        <Button variant="secondary" size="sm">View Profile</Button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveTalent(talent.talent_id)}
                                                        className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--req-declined)]"
                                                        title="Remove from list"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {selectedListTalents.length === 0 && (
                                        <div className="text-center py-10 text-[var(--text-muted)]">
                                            No talents in this list yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                    <Users size={24} className="text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Select a shortlist</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Click on a shortlist to view saved talent
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

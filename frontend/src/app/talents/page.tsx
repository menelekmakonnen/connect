'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { TalentCard, TalentCardSkeleton } from '@/components/talent/TalentCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Talent } from '@/lib/types';

import { TalentHero } from '@/components/talents/TalentHero';

export default function RosterPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter states
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAvailability, setSelectedAvailability] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    // Data states
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch talents from API
    useEffect(() => {
        const fetchTalents = async () => {
            setLoading(true);
            setError('');
            try {
                const result = await api.talents.search({
                    query: searchQuery,
                    roles: selectedRole,
                    city: selectedCity,
                    availability: selectedAvailability,
                    verified_only: verifiedOnly
                });
                setTalents(result.talents || []);
            } catch (err) {
                console.error('Failed to fetch talents:', err);
                setError('Failed to load roster. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchTalents();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedRole, selectedCity, selectedAvailability, verifiedOnly]);

    return (
        <div className="space-y-6">


            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Talents</h1>
                    <p className="text-zinc-400 mt-1">
                        {loading ? 'Searching talent...' : `${talents.length} talent available`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                            className={cn(
                                "p-2 rounded-md transition-colors",
                                viewMode === 'grid' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                            className={cn(
                                "p-2 rounded-md transition-colors",
                                viewMode === 'list' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="flex flex-col gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            className={cn("gap-2", showFilters && "border-amber-500/50 text-amber-500 bg-amber-500/10")}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            Filters
                        </Button>

                        <div
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer select-none transition-colors",
                                verifiedOnly
                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            )}
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                verifiedOnly ? "bg-amber-500 border-amber-500" : "border-zinc-600"
                            )}>
                                {verifiedOnly && <div className="w-2 h-2 bg-black rounded-sm" />}
                            </div>
                            <span className="text-sm font-medium">Verified Only</span>
                        </div>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 pt-4 border-t border-zinc-800/50 animate-in slide-in-from-top-2">
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                aria-label="Filter by role"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="">All Roles</option>
                                <option value="Director">Director</option>
                                <option value="Producer">Producer</option>
                                <option value="Cinematographer">Cinematographer (DP)</option>
                                <option value="Editor">Editor</option>
                                <option value="Makeup Artist">Makeup Artist</option>
                                <option value="Sound Recordist">Sound Recordist</option>
                                <option value="Gaffer">Gaffer</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">City</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                aria-label="Filter by city"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="">All Cities</option>
                                <option value="Accra">Accra</option>
                                <option value="Kumasi">Kumasi</option>
                                <option value="Tema">Tema</option>
                                <option value="Takoradi">Takoradi</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">Availability</label>
                            <select
                                value={selectedAvailability}
                                onChange={(e) => setSelectedAvailability(e.target.value)}
                                aria-label="Filter by availability"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="">Any Status</option>
                                <option value="available">Available</option>
                                <option value="limited">Limited Avail</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">Budget Tier</label>
                            <select
                                aria-label="Filter by budget"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="">Any Budget</option>
                                <option value="$">$ (Student/Indie)</option>
                                <option value="$$">$$ (Standard)</option>
                                <option value="$$$">$$$ (Premium)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Roster Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <TalentCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                    <div className="text-red-400 mb-2">Error loading roster</div>
                    <p className="text-zinc-500 text-sm mb-4">{error}</p>
                    <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            ) : talents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {talents.map((talent) => (
                        <TalentCard key={talent.talent_id} talent={{ ...talent, roles: talent.roles || [] }} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <Search className="text-zinc-600" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No talent found</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                        We couldn't find any talent matching your search filters. Try adjusting your criteria.
                    </p>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedRole('');
                            setSelectedCity('');
                            setSelectedAvailability('');
                            setVerifiedOnly(false);
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}

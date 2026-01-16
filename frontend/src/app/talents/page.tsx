'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, List as ListIcon, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TalentCard, TalentCardSkeleton } from '@/components/talent/TalentCard';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Talent } from '@/lib/types';

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
                console.log('[Roster] API Result:', result);
                const talentData = Array.isArray(result.talents) ? result.talents : [];
                setTalents(talentData);
            } catch (err) {
                console.error('Failed to fetch talents:', err);
                setError('Failed to load roster. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchTalents();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedRole, selectedCity, selectedAvailability, verifiedOnly]);

    return (
        <div className="space-y-8 animate-fade-in py-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                        <LayoutGrid size={12} />
                        Professional Roster
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Meet the Talent</h1>
                    <p className="text-slate-400 mt-2">
                        {loading ? 'Scanning the network...' : `${talents.length} verified creative professionals found`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                            className={cn(
                                "p-2.5 rounded-lg transition-all",
                                viewMode === 'grid' ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                            className={cn(
                                "p-2.5 rounded-lg transition-all",
                                viewMode === 'list' ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>

                    <Button variant="secondary" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <ArrowUpDown size={16} />
                        Sort
                    </Button>
                </div>
            </div>

            {/* Premium Filter Controls */}
            <div className="bg-[#1e2130] p-6 rounded-[24px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or specific skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className={cn(
                                "gap-2 px-6 py-4 h-auto rounded-2xl transition-all border border-white/10",
                                showFilters ? "bg-purple-600 text-white border-purple-500" : "bg-white/5 text-slate-300 hover:bg-white/10"
                            )}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} />
                            Detailed Filters
                        </Button>

                        <div
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-2xl border cursor-pointer select-none transition-all shadow-sm h-full",
                                verifiedOnly
                                    ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                            )}
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                verifiedOnly ? "bg-purple-500 border-purple-500 shadow-[0_0_8px_var(--purple-500)]" : "border-slate-600"
                            )}>
                                {verifiedOnly && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                            <span className="text-sm font-bold">Verified Only</span>
                        </div>
                    </div>
                </div>

                {/* Glassmorphic Expanded Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/5 animate-scale-in">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category / Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            >
                                <option value="">All Categories</option>
                                <option value="Director">Director</option>
                                <option value="Producer">Producer</option>
                                <option value="Cinematographer">Cinematographer (DP)</option>
                                <option value="Editor">Editor</option>
                                <option value="Makeup Artist">Makeup Artist</option>
                                <option value="Sound Recordist">Sound Recordist</option>
                                <option value="Gaffer">Gaffer</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            >
                                <option value="">All Regions</option>
                                <option value="Accra">Accra Central</option>
                                <option value="Kumasi">Kumasi / Ashanti</option>
                                <option value="Tema">Tema / Greater Accra</option>
                                <option value="Takoradi">Western Region</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Availability</label>
                            <select
                                value={selectedAvailability}
                                onChange={(e) => setSelectedAvailability(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            >
                                <option value="">Any Availability</option>
                                <option value="available">Immediate (Available)</option>
                                <option value="limited">Contact for Info (Limited)</option>
                                <option value="unavailable">Booked Solid</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Production Budget Tier</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            >
                                <option value="">All Budget Levels</option>
                                <option value="$">$ Indie / Commercial</option>
                                <option value="$$">$$ Professional Suite</option>
                                <option value="$$$">$$$ Premium Production</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Display */}
            <div className="pt-4">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <TalentCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-32 bg-[#1a1d29] rounded-[32px] border border-white/5">
                        <div className="text-red-400 mb-4 inline-flex p-4 rounded-full bg-red-500/10">
                            <Filter size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Error connecting to network</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8">{error}</p>
                        <Button variant="secondary" onClick={() => window.location.reload()} className="bg-white/5 border-white/10 text-white">
                            Reconnect Now
                        </Button>
                    </div>
                ) : (Array.isArray(talents) && talents.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {talents.map((talent) => (
                            talent && talent.talent_id && (
                                <TalentCard key={talent.talent_id} talent={{ ...talent, roles: talent.roles || [] }} />
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-[#1a1d29] rounded-[32px] border border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <Search className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No talent found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            We couldn&apos;t find any professionals matching those criteria. Try expanding your search or clearing filters.
                        </p>
                        <Button
                            variant="secondary"
                            className="btn-gradient border-none px-8 py-3 h-auto rounded-xl"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedRole('');
                                setSelectedCity('');
                                setSelectedAvailability('');
                                setVerifiedOnly(false);
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { TalentCard } from '@/components/talent/TalentCard';
import { Button } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { TalentCard as TalentCardType } from '@/lib/types';

// Mock data for featured talents on landing page
const FEATURED_TALENTS: TalentCardType[] = [
    {
        talent_id: '1',
        public_slug: 'kofi-mensah',
        display_name: 'Kofi Mensah',
        profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        roles: [{ role_id: 'dp', role_name: 'Director of Photography', role_category: 'Camera', search_terms: '', active: true }],
        headline: 'Cinematographer with 10+ years experience',
        city: 'Accra',
        verification_level: 'pro_verified',
        availability_status: 'available',
        featured: true,
        tags_style: [],
        rate_range: { min: 800, max: 1500, currency: 'GHS' }
    },
    {
        talent_id: '2',
        public_slug: 'ama-serwaa',
        display_name: 'Ama Serwaa',
        profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        roles: [{ role_id: 'editor', role_name: 'Senior Video Editor', role_category: 'Post', search_terms: '', active: true }],
        headline: 'Expert in Adobe Premiere and DaVinci Resolve',
        city: 'Kumasi',
        verification_level: 'work_verified',
        availability_status: 'available',
        featured: true,
        tags_style: [],
        rate_range: { min: 600, max: 1000, currency: 'GHS' }
    },
    {
        talent_id: '3',
        public_slug: 'david-osei',
        display_name: 'David Osei',
        profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        roles: [{ role_id: 'gaffer', role_name: 'Chief Gaffer', role_category: 'Lighting/Grip', search_terms: '', active: true }],
        headline: 'Lighting specialist for high-end commercials',
        city: 'Accra',
        verification_level: 'pro_verified',
        availability_status: 'available',
        featured: true,
        tags_style: [],
        rate_range: { min: 700, max: 1200, currency: 'GHS' }
    }
];

export function FeaturedTalents() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold uppercase tracking-widest text-xs">
                            <Sparkles size={14} />
                            Trending
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Featured Talent This Week
                        </h2>
                        <p className="text-slate-400 max-w-xl">
                            Discover the most reliable and highly-rated creative professionals in Ghana ready to bring your vision to life.
                        </p>
                    </div>
                    <Link href="/talents">
                        <Button variant="outline" className="border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-white">
                            View All Talent
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURED_TALENTS.map((talent) => (
                        <TalentCard key={talent.talent_id} talent={talent} />
                    ))}
                </div>
            </div>
        </section>
    );
}

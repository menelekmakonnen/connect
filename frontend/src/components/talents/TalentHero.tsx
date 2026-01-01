'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Star,
    Zap,
    Award,
    TrendingUp,
    MapPin,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Mock data for demonstration - in production this would come from API
interface FeaturedTalent {
    id: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    verified: boolean;
    location: string;
    badges: string[];
    quote: string;
}

const FEATURED_TALENTS: FeaturedTalent[] = [
    {
        id: 'feat-1',
        name: 'Kwame Mensah',
        role: 'Director of Photography',
        image: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=2787&auto=format&fit=crop',
        rating: 4.9,
        verified: true,
        location: 'Accra, GH',
        badges: ['Top Rated', 'Expert Light'],
        quote: "Visual storytelling is about capturing the soul of the scene, not just the action."
    },
    {
        id: 'feat-2',
        name: 'Amara Okafor',
        role: 'Senior Editor',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop',
        rating: 5.0,
        verified: true,
        location: 'Kumasi, GH',
        badges: ['Fast Turnaround', 'Color Grade Pro'],
        quote: "Rhythm is everything. I edit to the heartbeat of the narrative."
    },
    {
        id: 'feat-3',
        name: 'David Asante',
        role: 'Sound Engineer',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop',
        rating: 4.8,
        verified: true,
        location: 'Tema, GH',
        badges: ['On-Location Expert', 'Crisp Audio'],
        quote: "Clean sound is the difference between an amateur video and a professional film."
    }
];

interface FeaturedSkill {
    name: string;
    count: number;
    icon: any;
    image: string;
}

const FEATURED_SKILLS: FeaturedSkill[] = [
    { name: 'Gaffers', count: 12, icon: Zap, image: 'https://images.unsplash.com/photo-1621352382101-b54133499238?q=80&w=2940&auto=format&fit=crop' },
    { name: 'Drone Pilots', count: 8, icon: TrendingUp, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2940&auto=format&fit=crop' },
    { name: 'Makeup Artists', count: 15, icon: Star, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2942&auto=format&fit=crop' }
];

interface FeaturedCategory {
    title: string;
    description: string;
    image: string;
}

type SlideData =
    | { type: 'talent'; data: FeaturedTalent }
    | { type: 'skill'; data: FeaturedSkill }
    | { type: 'category'; data: FeaturedCategory };

export function TalentHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Determines daily featured talent deterministically based on date
    // No useEffect + setState needed, which fixes React warning
    const dailyTalent = useMemo(() => {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const talentIndex = seed % FEATURED_TALENTS.length;
        return FEATURED_TALENTS[talentIndex];
    }, []);

    const slides: SlideData[] = [
        { type: 'talent', data: dailyTalent },
        { type: 'skill', data: FEATURED_SKILLS[0] }, // Could also rotate
        { type: 'category', data: { title: 'Music Video Pros', description: 'Talent with experience in high-energy music production.', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2940&auto=format&fit=crop' } }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]); // Dependencies explicit

    const currentSlideData = slides[currentSlide];

    return (
        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden mb-12 bg-black border border-white/10 group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out transform scale-105 group-hover:scale-110"
                        style={{
                            backgroundImage: `url(${currentSlideData.data.image})`
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 container mx-auto px-6 md:px-12 flex items-center">
                        <div className="max-w-2xl">
                            {currentSlideData.type === 'talent' && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/50 mb-6 backdrop-blur-md">
                                        <Award size={14} className="text-[var(--accent-primary)]" />
                                        <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">Daily Featured Talent</span>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight leading-none">
                                        {currentSlideData.data.name}
                                    </h1>

                                    <div className="flex items-center gap-4 text-xl text-zinc-300 mb-6">
                                        <span className="font-medium text-[var(--accent-secondary)]">{currentSlideData.data.role}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            {currentSlideData.data.location}
                                        </div>
                                    </div>

                                    <blockquote className="border-l-2 border-[var(--accent-primary)] pl-4 italic text-zinc-400 mb-8 max-w-lg">
                                        "{currentSlideData.data.quote}"
                                    </blockquote>

                                    <div className="flex gap-4">
                                        <Link href={`/talents/${currentSlideData.data.id}`}>
                                            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Button variant="secondary" size="lg" className="border-zinc-700 hover:bg-zinc-800">
                                            Check Availability
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentSlideData.type === 'skill' && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 mb-6 backdrop-blur-md">
                                        <Zap size={14} className="text-purple-400" />
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">High Demand Skill</span>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                                        Top Rated <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                            {currentSlideData.data.name}
                                        </span>
                                    </h1>

                                    <p className="text-xl text-zinc-300 mb-8 max-w-lg">
                                        We have {currentSlideData.data.count} verified professionals ready to light up your next set.
                                    </p>

                                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                                        Browse {currentSlideData.data.name}
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </motion.div>
                            )}

                            {currentSlideData.type === 'category' && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 mb-6 backdrop-blur-md">
                                        <TrendingUp size={14} className="text-blue-400" />
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Trending Collection</span>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                                        {currentSlideData.data.title}
                                    </h1>

                                    <p className="text-xl text-zinc-300 mb-8 max-w-lg">
                                        {currentSlideData.data.description}
                                    </p>

                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                                        Explore Collection
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute right-6 bottom-6 flex gap-2 z-20">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                        role="button"
                        onClick={() => setCurrentSlide(idx)}
                    />
                ))}
            </div>
        </div>
    );
}

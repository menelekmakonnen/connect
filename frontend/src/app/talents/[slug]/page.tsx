'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, RoleBadge } from '@/components/ui';
import { api } from '@/lib/api';
import { Talent, TalentLink } from '@/lib/types';
import {
    Instagram,
    Globe,
    Send,
    MessageCircle,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Youtube,
    Linkedin,
    MapPin,
    CheckCircle2
} from 'lucide-react';
import { formatRateRange } from '@/lib/utils';
import { SendRequestModal } from '@/components/requests/SendRequestModal';

export default function TalentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [talent, setTalent] = useState<Talent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        loadTalent();
    }, [slug]);

    const loadTalent = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.talents.getById(slug);
            setTalent(data);
        } catch (err) {
            console.error('Failed to load talent:', err);
            setError('Talent not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    if (error || !talent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
                <p className="text-[var(--text-secondary)] mb-6">{error || "We couldn't find the talent you're looking for."}</p>
                <Link href="/roster">
                    <Button variant="secondary">
                        <ArrowLeft size={16} />
                        Back to Roster
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header / Cover (Optional - simplicity for MVP) */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                <div className="page-container py-4">
                    <Link href="/roster" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <ArrowLeft size={16} />
                        Back to Roster
                    </Link>
                </div>
            </div>

            <div className="page-container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-[var(--bg-surface)] shadow-xl">
                                    <img
                                        src={talent.avatar_url || 'https://via.placeholder.com/150'}
                                        alt={talent.display_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[var(--bg-elevated)]" title="Available" />
                            </div>

                            <h1 className="text-2xl font-bold mb-1">{talent.display_name}</h1>
                            <p className="text-[var(--text-secondary)] mb-4">{talent.headline || 'Creative Professional'}</p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {talent.roles?.map((role) => (
                                    <RoleBadge key={role.role_id} name={role.role_name} category={role.role_category} />
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mb-6">
                                <span>{talent.city}{talent.neighborhood ? `, ${talent.neighborhood}` : ''}</span>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => setIsRequestModalOpen(true)}
                                >
                                    <Send size={20} />
                                    Send Request
                                </Button>
                                <Button variant="secondary" className="w-full">
                                    <MessageCircle size={20} />
                                    Message
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-[var(--text-secondary)] whitespace-pre-line">
                                {talent.bio || 'No bio provided.'}
                            </p>

                            {talent.availability_notes && (
                                <div className="mt-4 p-4 rounded bg-[var(--bg-hover)]">
                                    <p className="text-sm">
                                        <span className="font-semibold text-[var(--accent-primary)]">Availability Note:</span>{' '}
                                        {talent.availability_notes}
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* Rates & Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    Rates
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold text-lg">
                                            {formatRateRange(talent.day_rate_min, talent.day_rate_max)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)]">
                                        Rates are indicative and may vary based on project scope.
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    Links
                                </h3>
                                <div className="space-y-3">
                                    {talent.links?.find(l => l.link_type === 'instagram') && (
                                        <a
                                            href={(talent.links.find(l => l.link_type === 'instagram') as TalentLink).url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                                        >
                                            <Instagram size={20} />
                                            <span className="font-medium">Instagram</span>
                                        </a>
                                    )}
                                    {talent.links?.find(l => l.link_type === 'website') && (
                                        <a
                                            href={(talent.links.find(l => l.link_type === 'website') as TalentLink).url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                                        >
                                            <Globe size={20} />
                                            <span className="font-medium">Portfolio / Website</span>
                                        </a>
                                    )}
                                    {(!talent.links?.some(l => l.link_type === 'instagram' || l.link_type === 'website')) && (
                                        <p className="text-sm text-[var(--text-muted)]">No public links provided.</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <SendRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                talentId={talent.talent_id}
                talentName={talent.display_name}
            />
        </div>
    );
}

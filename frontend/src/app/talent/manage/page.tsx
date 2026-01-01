'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button, Card, Input } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
    User, Upload, Image as ImageIcon, Eye, EyeOff,
    Loader2, Plus, Globe, Lock,
    Youtube, Instagram, Twitter, Linkedin, Link, PlayCircle, Trash2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TalentManagePage() {
    return (
        <ProtectedRoute>
            <TalentManager />
        </ProtectedRoute>
    );
}

function TalentManager() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Data State
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        youtube: '',
        twitter: '',
        linkedin: '',
        website: ''
    });
    const [embeds, setEmbeds] = useState<{ title: string; url: string; type: 'youtube' | 'instagram' | 'other' }[]>([]);
    const [newEmbedUrl, setNewEmbedUrl] = useState('');

    // Upload State
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);

    // Skill Suggestions (Bubble Data)
    const SUGGESTED_SKILLS = [
        'Camera Operation', 'Lighting Design', 'Sound Mixing',
        'Directing', 'Editing', 'Color Grading', 'VFX',
        'Makeup Artist', 'Costume Design', 'Set Design'
    ];

    useEffect(() => {
        // Load initial data (mock for now, would fetch from API)
        if (user) {
            // Simulator
            setBio("Passionate creative professional with defined experience.");
            setSkills(['Camera Operation']);
        }
    }, [user]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'profile') {
            setUploadingProfile(true);
            try {
                // Call API
                const res: any = await api.assets.upload(file, 'profile');
                setProfileImage(res.url); // Use returned URL
            } catch (err) {
                console.error("Upload failed", err);
                alert("Upload failed. Please try a smaller image.");
            } finally {
                setUploadingProfile(false);
            }
        }
    };

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter(s => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (!user?.user_id) return;

            await api.talents.update(user.user_id, {
                visibility,
                skills,
                bio,
                social_links: socialLinks,
                featured_embeds: embeds,
                profile_image: profileImage
            } as any); // Type assertion for now as Talent type might need sync
            // Show success feedback
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Failed to save profile', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Profile</h1>
                    <p className="text-[var(--text-secondary)]">Update your portfolio, skills, and availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border-subtle)]">
                        <button
                            onClick={() => setVisibility('public')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                visibility === 'public'
                                    ? "bg-[var(--accent-primary)] text-white shadow-sm"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            <Eye size={14} />
                            Public
                        </button>
                        <button
                            onClick={() => setVisibility('private')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                visibility === 'private'
                                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-subtle)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            <EyeOff size={14} />
                            Private
                        </button>
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                        {saving ? <Loader2 className="animate-spin" /> : <>Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Bio */}
                <div className="space-y-6">
                    <Card className="p-6 text-center">
                        <div className="relative inline-block group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--bg-elevated)] border-2 border-[var(--border-subtle)] mx-auto mb-4 relative">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                        <User size={40} />
                                    </div>
                                )}

                                {uploadingProfile && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>

                            <label className="cursor-pointer">
                                <span className="text-sm font-medium text-[var(--accent-primary)] hover:underline">Change Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} />
                            </label>
                        </div>

                        <div className="mt-4 text-left">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Your Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="mt-1 h-32 text-sm w-full p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none resize-none"
                                placeholder="Tell us about your experience..."
                            />
                        </div>
                    </Card>

                    {/* Stats / Quick Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Profile Strength</h3>
                        <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[var(--role-camera)] to-[var(--accent-primary)] h-full w-[70%]" />
                        </div>
                        <p className="text-xs text-right mt-1 text-[var(--text-muted)]">70% Complete</p>
                    </Card>
                </div>

                {/* Right Column: Skills & Evidence */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Skills Selector */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Skills & Roles</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Select all that apply. These help production managers find you.</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {SUGGESTED_SKILLS.map(skill => (
                                <motion.button
                                    key={skill}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-4 py-2 rounded-full text-sm border transition-all ${skills.includes(skill)
                                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-md'
                                        : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                                        }`}
                                >
                                    {skills.includes(skill) && <Plus size={12} className="inline mr-1" />}
                                    {skill}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a custom skill..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="max-w-xs"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newSkill) {
                                        toggleSkill(newSkill);
                                        setNewSkill('');
                                    }
                                }}
                            />
                            <Button variant="secondary" onClick={() => { if (newSkill) { toggleSkill(newSkill); setNewSkill(''); } }}>Add</Button>
                        </div>
                    </Card>

                    {/* Evidence / Portfolio */}
                    <Card className="p-6 border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors">
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] mb-4 text-[var(--text-muted)]">
                                <ImageIcon size={32} />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Portfolio Evidence</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
                                Upload up to 7 images showcasing your best work.
                                Make sure they are high quality.
                            </p>

                            <Button variant="secondary">
                                <Upload size={16} className="mr-2" />
                                Upload Evidence
                            </Button>
                        </div>
                    </Card>

                    {/* Social Connections */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Social Connections</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                                    <Instagram size={16} /> Instagram
                                </label>
                                <Input
                                    placeholder="https://instagram.com/..."
                                    value={socialLinks.instagram}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                                    <Youtube size={16} /> YouTube Channel
                                </label>
                                <Input
                                    placeholder="https://youtube.com/@..."
                                    value={socialLinks.youtube}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                                    <Linkedin size={16} /> LinkedIn
                                </label>
                                <Input
                                    placeholder="https://linkedin.com/in/..."
                                    value={socialLinks.linkedin}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                                    <Globe size={16} /> Website
                                </label>
                                <Input
                                    placeholder="https://yourportfolio.com"
                                    value={socialLinks.website}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Featured Embeds */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Featured Content</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            Embed videos or posts directly on your profile. Paste a YouTube or Instagram link.
                        </p>

                        <div className="flex gap-2 mb-6">
                            <Input
                                placeholder="Paste YouTube or Instagram link..."
                                value={newEmbedUrl}
                                onChange={(e) => setNewEmbedUrl(e.target.value)}
                            />
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    if (!newEmbedUrl) return;
                                    let type: 'youtube' | 'instagram' | 'other' = 'other';
                                    if (newEmbedUrl.includes('youtube') || newEmbedUrl.includes('youtu.be')) type = 'youtube';
                                    else if (newEmbedUrl.includes('instagram')) type = 'instagram';

                                    setEmbeds([...embeds, { title: 'Featured Content', url: newEmbedUrl, type }]);
                                    setNewEmbedUrl('');
                                }}
                            >
                                <Plus size={16} className="mr-2" />
                                Add Embed
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {embeds.map((embed, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                                            {embed.type === 'youtube' && <Youtube size={20} />}
                                            {embed.type === 'instagram' && <Instagram size={20} />}
                                            {embed.type === 'other' && <Link size={20} />}
                                        </div>
                                        <div className="truncate max-w-[200px] text-sm font-medium">
                                            {embed.url}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                                        onClick={() => setEmbeds(embeds.filter((_, idx) => idx !== i))}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            ))}
                            {embeds.length === 0 && (
                                <div className="text-center py-8 text-[var(--text-muted)] text-sm border-2 border-dashed border-[var(--border-subtle)] rounded-lg">
                                    No featured content yet.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

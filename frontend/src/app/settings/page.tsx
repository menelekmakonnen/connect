'use client';

import { useState, useEffect } from 'react';
import { useAuth, useAuthStore } from '@/lib/auth';
import { Button, Card, Input } from '@/components/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { User, Mail, Bell, Shield, Moon, LogOut, Loader2, Save, FolderKanban } from 'lucide-react';

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance';

function SettingsContent() {
    const { user, logout } = useAuth();
    const setAuth = useAuthStore(state => state.setAuth);
    const token = useAuthStore(state => state.token);

    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        display_name: '',
        email: ''
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                display_name: user.display_name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user || !token) return;

        setIsSaving(true);

        // Mock API call simulation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update local store
        const updatedUser = { ...user, display_name: formData.display_name };
        setAuth(updatedUser, token);

        setIsSaving(false);
        // Show success message (could add toast later)
        // alert('Settings saved!'); 
    };

    const handleLogout = () => {
        // Clear token
        localStorage.removeItem('icuni_token');
        // Redirect
        window.location.href = '/login';
    };

    const TabButton = ({ id, icon: Icon, label }: { id: SettingsTab | 'logout', icon: any, label: string }) => {
        if (id === 'logout') {
            return (
                <Button
                    variant="ghost"
                    className="w-full !justify-end text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-3"
                    onClick={handleLogout}
                >
                    {label}
                    <Icon size={18} />
                </Button>
            );
        }

        const isActive = activeTab === id;
        return (
            <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full !justify-end gap-3 transition-all ${isActive ? 'bg-[var(--bg-elevated)] font-medium border-r-2 border-[var(--accent-primary)] rounded-r-none' : 'text-[var(--text-secondary)] border-transparent'}`}
                onClick={() => setActiveTab(id as SettingsTab)}
            >
                {label}
                <Icon size={18} className={isActive ? 'text-[var(--accent-primary)]' : ''} />
            </Button>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-4 lg:col-span-3 space-y-1">
                    <div className="flex flex-col gap-1">
                        <Button
                            variant="ghost"
                            className="w-full !justify-end text-[var(--text-secondary)] mb-6 gap-3 hover:text-[var(--accent-primary)]"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Back to Dashboard
                            <FolderKanban size={18} />
                        </Button>

                        <TabButton id="profile" icon={User} label="Profile" />
                        <TabButton id="notifications" icon={Bell} label="Notifications" />
                        <TabButton id="privacy" icon={Shield} label="Privacy & Security" />
                        <TabButton id="appearance" icon={Moon} label="Appearance" />

                        <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
                            <TabButton id="logout" icon={LogOut} label="Sign Out" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <Card className="p-6 animate-fade-in">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <User size={20} className="text-[var(--accent-primary)]" />
                                Personal Information
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Display Name</label>
                                    <Input
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="Your display name"
                                    />
                                    <p className="text-xs text-[var(--text-muted)]">This name will be visible to other users.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                                        <div className="flex items-center p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-70">
                                            <Mail size={16} className="mr-2" />
                                            {user?.email || 'No email attached'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[var(--text-secondary)]">Account Type</label>
                                        <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-medium text-sm">
                                            {(!user?.account_type || user.account_type.toLowerCase() === 'pm')
                                                ? 'Production Management'
                                                : user.account_type.charAt(0).toUpperCase() + user.account_type.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex justify-end">
                                <Button onClick={handleSave} disabled={isSaving || !formData.display_name.trim()}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <Card className="p-6 animate-fade-in">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-[var(--accent-primary)]" />
                                Notification Preferences
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                                    <div>
                                        <p className="font-medium">Request Updates</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Get notified when status changes on your requests</p>
                                    </div>
                                    <div className="h-6 w-11 bg-[var(--accent-primary)] rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                                    <div>
                                        <p className="font-medium">New Messages</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Receive emails when you get a new message</p>
                                    </div>
                                    <div className="h-6 w-11 bg-[var(--accent-primary)] rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                                    <div>
                                        <p className="font-medium">Marketing Emails</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Receive news and special offers</p>
                                    </div>
                                    <div className="h-6 w-11 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 h-4 w-4 bg-[var(--text-muted)] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* PRIVACY TAB */}
                    {activeTab === 'privacy' && (
                        <Card className="p-6 animate-fade-in">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-[var(--accent-primary)]" />
                                Privacy & Security
                            </h2>
                            <p className="text-[var(--text-muted)]">Privacy settings are managed by your Google Account.</p>
                            <Button variant="secondary" className="mt-4" onClick={() => window.open('https://myaccount.google.com/', '_blank')}>
                                Manage Google Account
                            </Button>
                        </Card>
                    )}

                    {/* APPEARANCE TAB */}
                    {activeTab === 'appearance' && (
                        <Card className="p-6 animate-fade-in">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Moon size={20} className="text-[var(--accent-primary)]" />
                                Appearance
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                    <button
                                        onClick={() => document.documentElement.classList.remove('dark')}
                                        className="p-4 rounded-xl border border-[var(--border-subtle)] bg-white text-black text-left hover:border-[var(--accent-primary)] transition-all"
                                    >
                                        <div className="text-sm font-bold mb-1">Light</div>
                                        <div className="text-xs opacity-60">Clean & Bright</div>
                                    </button>
                                    <button
                                        onClick={() => document.documentElement.classList.add('dark')}
                                        className="p-4 rounded-xl border border-[var(--accent-primary)] bg-black text-white text-left hover:shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)] transition-all"
                                    >
                                        <div className="text-sm font-bold mb-1">Dark</div>
                                        <div className="text-xs opacity-60">Modern & Sleek</div>
                                    </button>
                                    <button
                                        className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-left opacity-50 cursor-not-allowed"
                                    >
                                        <div className="text-sm font-bold mb-1">System</div>
                                        <div className="text-xs opacity-60">Auto-detect</div>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

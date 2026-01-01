'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useAuthStore } from '@/lib/auth';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
    Users,
    FolderKanban,
    Inbox,
    Bookmark,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    LogOut
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FolderKanban, public: false },
    { name: 'Talents', href: '/talents', icon: Users, public: true },
    { name: 'Projects', href: '/projects', icon: Sparkles, public: true },
    { name: 'Requests', href: '/requests', icon: Inbox, public: false },
    { name: 'Shortlists', href: '/shortlists', icon: Bookmark, public: false },
    { name: 'Manage Talent', href: '/talent/manage', icon: Users, public: false },
];

const adminNavigation = [
    { name: 'Verification', href: '/verification', icon: Shield, public: false },
    { name: 'Settings', href: '/settings', icon: Settings, public: false },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth(); // Assuming useAuth exposes isAuthenticated
    const { clearAuth } = useAuthStore();
    const { isSidebarCollapsed, toggleSidebar } = useAppStore();

    // Prevent hydration mismatch for persisted state
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem('icuni_token');
        router.push('/login');
    };

    const isCollapsed = mounted ? isSidebarCollapsed : false;

    // Filter navigation based on auth
    const filteredNav = navigation.filter(item => isAuthenticated || item.public);
    const filteredAdminNav = adminNavigation.filter(item => isAuthenticated);

    return (
        <aside
            className={cn(
                "app-sidebar flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[72px]" : "w-[240px]"
            )}
        >
            {/* Header / Logo */}
            <div className={cn("flex items-center border-b border-[var(--border-subtle)] transition-all", isCollapsed ? "p-3 justify-center" : "p-5 justify-between")}>
                <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                    <img
                        src="/icuni_favicon_concept_1767266752441.png"
                        alt="Logo"
                        className="w-8 h-8 min-w-[32px] rounded-lg object-cover"
                    />
                    {!isCollapsed && (
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                            ICUNI Connect
                        </span>
                    )}
                </Link>

                {/* Collapse Toggle */}
                {!isCollapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>

            {/* Collapsed Toggle (if collapsed, show below logo) */}
            {isCollapsed && (
                <div className="flex justify-center py-2 border-b border-[var(--border-subtle)]">
                    <button
                        onClick={toggleSidebar}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                        aria-label="Expand sidebar"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
                {!isCollapsed && (
                    <div className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider animate-fade-in">
                        Main
                    </div>
                )}

                {filteredNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                                isActive
                                    ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
                                isCollapsed && 'justify-center px-0 py-3'
                            )}
                        >
                            <item.icon size={20} className={cn("flex-shrink-0", isActive && "text-[var(--accent-primary)]")} />

                            {!isCollapsed && (
                                <>
                                    <span className="truncate">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}

                {/* Admin Navigation (Only if authenticated) */}
                {filteredAdminNav.length > 0 && (
                    <>
                        <div className={cn("pt-4 mt-4 border-t border-[var(--border-subtle)]", isCollapsed && "border-t mx-2")}>
                            {!isCollapsed && (
                                <div className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider animate-fade-in">
                                    Admin
                                </div>
                            )}

                            {filteredAdminNav.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        title={isCollapsed ? item.name : undefined}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                                            isActive
                                                ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
                                            isCollapsed && 'justify-center px-0 py-3'
                                        )}
                                    >
                                        <item.icon size={20} className="flex-shrink-0" />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                {isAuthenticated && user ? (
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border-default)] flex-shrink-0">
                            <span className="text-xs font-bold text-[var(--accent-primary)]">
                                {user.display_name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>

                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-[var(--text-primary)]">{user.display_name}</p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                            </div>
                        )}

                        {!isCollapsed && (
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                aria-label="Log out"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    /* Guest View */
                    <div className={cn("flex flex-col gap-2", isCollapsed ? "items-center" : "")}>
                        {!isCollapsed ? (
                            <Link href="/login" className="w-full">
                                <button className="w-full py-2 px-4 bg-[var(--accent-primary)] text-black rounded-lg text-sm font-medium hover:bg-[var(--accent-secondary)] transition-colors">
                                    Sign In
                                </button>
                            </Link>
                        ) : (
                            <Link href="/login" title="Sign In">
                                <button className="w-8 h-8 flex items-center justify-center bg-[var(--accent-primary)] text-black rounded-lg hover:bg-[var(--accent-secondary)] transition-colors">
                                    <LogOut size={16} className="rotate-180" />
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}


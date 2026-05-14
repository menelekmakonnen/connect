/**
 * ICUNI Connect — Navigation Icon System
 * Google-inspired colorful circles with per-icon micro-animations.
 * Adapted from OSA NavIcons.jsx
 */
import React from 'react';
import { IconDashboard, IconTalents, IconProjects, IconRequests, IconInsights, IconSettings, IconLogout } from './icons';

export const NAV_COLORS = {
  dashboard: { bg: '#E8A838', icon: '#1a1a1a' },
  talents:   { bg: '#5B8DEF', icon: '#fff' },
  projects:  { bg: '#9D7AEA', icon: '#fff' },
  requests:  { bg: '#F0BE5A', icon: '#1a1a1a' },
  insights:  { bg: '#E85D9A', icon: '#fff' },
  settings:  { bg: '#6B7280', icon: '#fff' },
  logout:    { bg: '#504C46', icon: '#fff' },
};

export const NAV_ANIMATIONS = {
  dashboard: 'nav-anim-wiggle',
  talents:   'nav-anim-wave',
  projects:  'nav-anim-bounce',
  requests:  'nav-anim-flip',
  insights:  'nav-anim-pulse',
  settings:  'nav-anim-rotate',
  logout:    'nav-anim-slide',
};

export function NavIconWrap({ colorKey, active, collapsed, children }) {
  const c = NAV_COLORS[colorKey] || NAV_COLORS.dashboard;
  const animClass = NAV_ANIMATIONS[colorKey] || '';
  const size = collapsed ? 34 : 36;

  return (
    <div
      className={`${animClass}`}
      style={{
        width: size, height: size, borderRadius: '50%',
        backgroundColor: c.bg, color: c.icon,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transform: active ? 'scale(1.1)' : 'scale(1)',
        boxShadow: active
          ? `0 3px 12px ${c.bg}50, 0 0 0 3px ${c.bg}20`
          : `0 1px 4px ${c.bg}25`,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {children}
    </div>
  );
}

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/app/dashboard', icon: IconDashboard },
  { key: 'talents',   label: 'Talents',   path: '/app/talents',   icon: IconTalents },
  { key: 'projects',  label: 'Projects',  path: '/app/projects',  icon: IconProjects },
  { key: 'requests',  label: 'Requests',  path: '/app/requests',  icon: IconRequests },
  { key: 'insights',  label: 'Insights',  path: '/app/insights',  icon: IconInsights },
];

export const NAV_FOOTER = [
  { key: 'settings', label: 'Settings', path: '/app/settings', icon: IconSettings },
  { key: 'logout',   label: 'Logout',   path: null,            icon: IconLogout },
];

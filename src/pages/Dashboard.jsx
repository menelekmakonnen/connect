/**
 * ICUNI Connect — Dashboard
 * Stats overview + recent activity — wired to live API.
 */
import React, { useState, useEffect } from 'react';
import { authState, searchTalents, listProjects, listRequests, getAnalytics, listNotifications } from '../lib/api';
import { IconTalents, IconProjects, IconRequests, IconInsights, IconRefresh, IconClapperboard } from '../lib/icons';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="card" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</p>
          {trend && <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px' }}>{trend}</p>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: `${color}15`, color: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.5,
      }} />
    </div>
  );
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const user = authState.getUser();
  const [stats, setStats] = useState({ talents: '—', projects: '—', requests: '—', views: '—' });
  const [activity, setActivity] = useState([]);
  const [topRoles, setTopRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [talentsRes, projectsRes, requestsRes, analyticsRes, notifRes] = await Promise.allSettled([
          searchTalents({}),
          listProjects({}),
          listRequests({}),
          getAnalytics('30d'),
          listNotifications(),
        ]);

        const talents = talentsRes.status === 'fulfilled' && Array.isArray(talentsRes.value) ? talentsRes.value : [];
        const projects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value) ? projectsRes.value : [];
        const requests = requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value) ? requestsRes.value : [];
        const analytics = analyticsRes.status === 'fulfilled' ? analyticsRes.value : { total: 0, events: [] };
        const notifications = notifRes.status === 'fulfilled' && Array.isArray(notifRes.value) ? notifRes.value : [];

        // Stats
        const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'draft').length;
        const pendingRequests = requests.filter(r => r.STATUS === 'sent' || r.status === 'sent').length;
        const viewEvents = (analytics.events || []).filter(e => e.EVENT === 'profile_view' || e.EVENT === 'bubble_open');

        setStats({
          talents: formatCount(talents.length),
          projects: String(activeProjects),
          requests: String(pendingRequests),
          views: formatCount(viewEvents.length),
        });

        // Activity feed from analytics events + notifications
        const allEvents = [
          ...(analytics.events || []).slice(-10).map(e => ({
            text: formatEvent(e),
            time: timeAgo(e.TIMESTAMP),
            color: eventColor(e.EVENT),
          })),
          ...notifications.slice(-5).map(n => ({
            text: n.MESSAGE || n.TITLE,
            time: timeAgo(n.TIMESTAMP),
            color: 'var(--accent)',
          })),
        ].sort((a, b) => 0).slice(0, 6);

        setActivity(allEvents.length > 0 ? allEvents : [
          { text: 'Welcome to ICUNI Connect! Your creative ecosystem awaits.', time: 'Just now', color: 'var(--accent)' },
        ]);

        // Top roles from talents
        const roleCounts = {};
        talents.forEach(t => {
          (t.roles || []).forEach(r => {
            const name = typeof r === 'string' ? r : (r.name || r.ROLE_NAME);
            if (name) roleCounts[name] = (roleCounts[name] || 0) + 1;
          });
        });
        const sorted = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const maxCount = sorted[0]?.[1] || 1;
        setTopRoles(sorted.map(([role, count]) => ({
          role, count, pct: Math.round((count / maxCount) * 100),
        })));

      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Welcome back, {user?.name?.split(' ')[0] || 'Creator'} <IconClapperboard size={24} style={{ color: 'var(--accent)' }} /></h1>
        <p className="page-subtitle">Here's what's happening in your creative ecosystem.</p>
      </div>

      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard icon={IconTalents} label="Total Talents" value={stats.talents} color="#3b82f6" />
        <StatCard icon={IconProjects} label="Active Projects" value={stats.projects} color="#8b5cf6" />
        <StatCard icon={IconRequests} label="Pending Requests" value={stats.requests} color="#eab308" />
        <StatCard icon={IconInsights} label="Profile Views" value={stats.views} color="#ec4899" />
      </div>

      <div className="grid-2-col">
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Recent Activity</h3>
          {activity.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md) 0', borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, marginTop: 6, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.text}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Top Roles in Demand</h3>
          {topRoles.length === 0 && !loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No role data yet.</p>
          )}
          {topRoles.map((item, i) => (
            <div key={i} style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.role}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.count} talent{item.count !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-light))', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatEvent(e) {
  const type = e.EVENT || e.event || '';
  const entity = e.ENTITY_ID || '';
  switch (type) {
    case 'profile_view': return `A talent profile was viewed (${entity})`;
    case 'bubble_open': return `A talent bubble was previewed (${entity})`;
    case 'project_created': return `New project created (${entity})`;
    case 'request_sent': return `Deal memo request sent (${entity})`;
    case 'request_accepted': return `A deal memo was accepted (${entity})`;
    case 'request_declined': return `A deal memo was declined (${entity})`;
    case 'talent_created': return `New talent profile created (${entity})`;
    case 'lineup_add': return `Talent added to a project lineup`;
    default: return `${type.replace(/_/g, ' ')} — ${entity}`;
  }
}

function eventColor(type) {
  switch (type) {
    case 'request_accepted': return 'var(--success)';
    case 'request_declined': return 'var(--danger)';
    case 'request_sent': return 'var(--gold)';
    case 'project_created': return 'var(--purple)';
    case 'talent_created': return 'var(--accent)';
    default: return 'var(--info)';
  }
}

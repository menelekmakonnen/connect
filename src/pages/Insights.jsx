/**
 * ICUNI Connect — Insights Page
 * Platform analytics + personal stats — wired to live API.
 */
import React, { useState, useEffect } from 'react';
import { authState, searchTalents, listProjects, listRequests, getAnalytics } from '../lib/api';
import { IconTalents, IconProjects, IconEye, IconUsers, IconSend, IconCheck, IconClock, IconInsights } from '../lib/icons';

const RANGES = ['7d', '30d', '90d'];

function StatCard({ label, value, icon: Icon, color, subtitle }) {
  return (
    <div className="card" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</p>
          {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function Insights() {
  const [range, setRange] = useState('30d');
  const user = authState.getUser();
  const [platform, setPlatform] = useState({ talents: '—', projects: '—', visits: '—' });
  const [talentStats, setTalentStats] = useState({ bubbles: '—', views: '—', lineups: '—', requests: '—' });
  const [pmStats, setPmStats] = useState({ projects: '—', sent: '—', rate: '—', time: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [talentsRes, projectsRes, requestsRes, analyticsRes] = await Promise.allSettled([
          searchTalents({}),
          listProjects({}),
          listRequests({}),
          getAnalytics(range),
        ]);

        const talents = talentsRes.status === 'fulfilled' && Array.isArray(talentsRes.value) ? talentsRes.value : [];
        const projects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value) ? projectsRes.value : [];
        const requests = requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value) ? requestsRes.value : [];
        const analytics = analyticsRes.status === 'fulfilled' ? analyticsRes.value : { total: 0, events: [] };
        const events = analytics.events || [];

        // Platform stats
        const visits = events.filter(e => e.EVENT === 'profile_view' || e.EVENT === 'bubble_open').length;
        setPlatform({
          talents: formatCount(talents.length),
          projects: String(projects.length),
          visits: formatCount(visits),
        });

        // Talent personal stats
        const bubbleOpens = events.filter(e => e.EVENT === 'bubble_open').length;
        const profileViews = events.filter(e => e.EVENT === 'profile_view').length;
        const lineupAdds = events.filter(e => e.EVENT === 'lineup_add').length;
        const reqReceived = events.filter(e => e.EVENT === 'request_sent').length;
        setTalentStats({
          bubbles: String(bubbleOpens),
          views: String(profileViews),
          lineups: String(lineupAdds),
          requests: String(reqReceived),
        });

        // PM stats
        const totalAccepted = requests.reduce((s, r) => s + Number(r.ACCEPTED || 0), 0);
        const totalSent = requests.reduce((s, r) => s + Number(r.TOTAL_RECIPIENTS || 0), 0);
        const rate = totalSent > 0 ? Math.round((totalAccepted / totalSent) * 100) : 0;
        setPmStats({
          projects: String(projects.length),
          sent: String(requests.length),
          rate: rate + '%',
          time: '—',
        });

      } catch (err) {
        console.error('Insights load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range]);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="page-title">Insights</h1>
          <p className="page-subtitle">Platform analytics and your personal performance.</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', padding: 3 }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={range === r ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ borderRadius: 'var(--radius-full)', minWidth: 50, fontSize: '0.75rem' }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Public counters */}
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Platform Overview</h3>
      <div className="grid-stats" style={{ marginBottom: 'var(--space-2xl)' }}>
        <StatCard label="Total Talents" value={platform.talents} icon={IconTalents} color="#3b82f6" />
        <StatCard label="Projects Submitted" value={platform.projects} icon={IconProjects} color="#8b5cf6" />
        <StatCard label={`Activity Events (${range})`} value={platform.visits} icon={IconEye} color="#E8A838" />
      </div>

      {/* Personal talent stats */}
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Your Talent Profile</h3>
      <div className="grid-stats" style={{ marginBottom: 'var(--space-2xl)' }}>
        <StatCard label="Bubble Opens" value={talentStats.bubbles} icon={IconEye} color="var(--accent)" subtitle="People previewed your profile" />
        <StatCard label="Full Profile Views" value={talentStats.views} icon={IconUsers} color="var(--blue)" subtitle="Viewed your full profile" />
        <StatCard label="Added to Lineup" value={talentStats.lineups} icon={IconCheck} color="var(--success)" subtitle="Added to project lineups" />
        <StatCard label="Requests Received" value={talentStats.requests} icon={IconSend} color="var(--gold)" subtitle="Deal memo invitations" />
      </div>

      {/* PM stats */}
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Your PM Activity</h3>
      <div className="grid-stats">
        <StatCard label="Projects Created" value={pmStats.projects} icon={IconProjects} color="var(--purple)" />
        <StatCard label="Requests Sent" value={pmStats.sent} icon={IconSend} color="var(--accent)" />
        <StatCard label="Acceptance Rate" value={pmStats.rate} icon={IconCheck} color="var(--success)" />
        <StatCard label="Avg Response Time" value={pmStats.time} icon={IconClock} color="var(--gold)" />
      </div>
    </div>
  );
}

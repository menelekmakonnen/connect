/**
 * ICUNI Connect — Talents Page
 * Search, filter, and browse creative talent — wired to live API.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IconSearch, IconFilter, IconCamera, IconPin, IconVerified, IconInstagram, IconYouTube, IconTikTok, IconGlobe, IconLinkedIn, IconIMDb, IconAlertCircle } from '../lib/icons';
import SkeletonLoader from '../components/SkeletonLoader';
import TalentBubble from '../components/TalentBubble';
import { searchTalents, listRoles } from '../lib/api';

const tierColors = { unverified: 'var(--tier-unverified)', profile: 'var(--tier-profile)', profile_verified: 'var(--tier-profile)', work: 'var(--tier-work)', work_verified: 'var(--tier-work)', pro: 'var(--tier-pro)', pro_verified: 'var(--tier-pro)' };
const tierLabels = { unverified: 'Unverified', profile: 'Profile Verified', profile_verified: 'Profile Verified', work: 'Work Verified', work_verified: 'Work Verified', pro: 'Pro Verified', pro_verified: 'Pro Verified' };
const availColors = { available: 'pill-available', limited: 'pill-limited', unavailable: 'pill-unavailable' };
const availLabels = { available: 'Available', limited: 'Limited', unavailable: 'Unavailable' };

const socialIconMap = {
  instagram: IconInstagram, tiktok: IconTikTok, youtube: IconYouTube,
  linkedin: IconLinkedIn, imdb: IconIMDb, website: IconGlobe,
  ig: IconInstagram, yt: IconYouTube, tt: IconTikTok, web: IconGlobe,
  behance: IconGlobe, spotlight: IconGlobe, mandy: IconGlobe,
  maps_business: IconPin, other: IconGlobe,
};

function TalentCard({ talent, onClick }) {
  const initials = (talent.name || '').split(' ').map(n => n[0]).join('').substring(0, 2);
  const tier = talent.tier || 'unverified';
  const availability = talent.availability || 'available';
  const avatarUrl = talent.avatar
    ? `https://drive.google.com/thumbnail?id=${talent.avatar}&sz=w200`
    : null;

  return (
    <div className="card card-hoverable press-scale" style={{ padding: 'var(--space-lg)', textAlign: 'center' }} onClick={() => onClick?.(talent)}>
      {/* Avatar */}
      <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-md)' }}>
        {avatarUrl
          ? <img src={avatarUrl} alt={talent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : initials}
      </div>

      {/* Name + verification */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
        <h4 style={{ fontSize: '1rem' }}>{talent.name}</h4>
        <IconVerified size={16} style={{ color: tierColors[tier] }} />
      </div>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 'var(--space-md)' }}>
        <IconPin size={12} />{talent.location || 'Unknown'}
      </div>

      {/* Roles */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
        {(talent.roles || []).slice(0, 2).map((r, i) => (
          <span key={i} className="chip chip-role">{typeof r === 'string' ? r : r.name}</span>
        ))}
      </div>

      {/* Availability */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <span className={`chip ${availColors[availability] || 'pill-available'}`}>{availLabels[availability] || 'Available'}</span>
      </div>

      {/* Social icons */}
      {talent.socials && talent.socials.length > 0 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', color: 'var(--text-muted)' }}>
          {talent.socials.slice(0, 5).map((s, i) => {
            const platform = typeof s === 'string' ? s : s.platform;
            const Icon = socialIconMap[platform] || IconGlobe;
            return <Icon key={i} size={16} />;
          })}
        </div>
      )}
    </div>
  );
}

export default function Talents() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [talents, setTalents] = useState([]);
  const [roleFilters, setRoleFilters] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bubbleTalent, setBubbleTalent] = useState(null);
  const debounceRef = useRef(null);

  // Fetch roles for filter chips
  useEffect(() => {
    listRoles().then(roles => {
      if (Array.isArray(roles)) {
        const topRoles = roles.slice(0, 12).map(r => r.NAME || r.name || r);
        setRoleFilters(['All', ...topRoles]);
      }
    }).catch(() => {});
  }, []);

  // Fetch talents (debounced search)
  const fetchTalents = useCallback(async (query, roleFilter) => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (query) filters.query = query;
      if (roleFilter && roleFilter !== 'All') filters.role = roleFilter;
      const result = await searchTalents(filters);
      setTalents(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Failed to fetch talents:', err);
      setError(err.message);
      setTalents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchTalents('', 'All'); }, [fetchTalents]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTalents(search, activeFilter);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, activeFilter, fetchTalents]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Talents</h1>
        <p className="page-subtitle">Discover Ghana's finest creative professionals.</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <span className="search-bar-icon"><IconSearch size={16} /></span>
          <input placeholder="Search by name, role, or skill..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary btn-sm"><IconFilter size={14} /> Filters</button>
      </div>

      {/* Role filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {roleFilters.map(f => (
          <button key={f} className={`chip chip-filter ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Results */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
        {loading ? 'Loading...' : `Showing ${talents.length} talent${talents.length !== 1 ? 's' : ''}`}
      </p>

      {error && (
        <div className="card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--danger)', marginBottom: 'var(--space-lg)' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertCircle size={16} /> {error}</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={() => fetchTalents(search, activeFilter)}>Retry</button>
        </div>
      )}

      {loading ? (
        <SkeletonLoader variant="talents" />
      ) : talents.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-state-icon"><IconSearch size={48} style={{ color: 'var(--text-muted)' }} /></div>
          <h3>No talents found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid-talents">
          {talents.map(t => <TalentCard key={t.id} talent={t} onClick={setBubbleTalent} />)}
        </div>
      )}

      {/* Talent Bubble drawer */}
      {bubbleTalent && (
        <TalentBubble talent={bubbleTalent} onClose={() => setBubbleTalent(null)} />
      )}
    </div>
  );
}

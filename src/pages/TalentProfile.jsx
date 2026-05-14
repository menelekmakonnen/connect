/**
 * ICUNI Connect — Full Talent Profile Page
 * Tabs: Overview, Roles & Rates, Portfolio, External Presence
 * Owner actions: Edit, Hide, Request Deletion
 * Wired to live API via getTalent()
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authState, getTalent } from '../lib/api';
import {
  IconChevronLeft, IconEdit, IconEyeOff, IconTrash, IconPin, IconVerified,
  IconCamera, IconMail, IconPhone, IconGlobe, IconStar, IconPlus, IconShare,
  IconInstagram, IconYouTube, IconTikTok, IconLinkedIn, IconIMDb, IconBehance,
  IconExternalLink, IconImage, IconCalendar, IconAlertCircle
} from '../lib/icons';
import SkeletonLoader from '../components/SkeletonLoader';

const tierColors = { unverified: 'var(--tier-unverified)', profile: 'var(--tier-profile)', profile_verified: 'var(--tier-profile)', work: 'var(--tier-work)', work_verified: 'var(--tier-work)', pro: 'var(--tier-pro)', pro_verified: 'var(--tier-pro)' };
const tierLabels = { unverified: 'Unverified', profile: 'Profile Verified', profile_verified: 'Profile Verified', work: 'Work Verified', work_verified: 'Work Verified', pro: 'Pro Verified', pro_verified: 'Pro Verified' };
const availPills = { available: 'pill-available', limited: 'pill-limited', unavailable: 'pill-unavailable' };
const availLabels = { available: 'Available', limited: 'Limited', unavailable: 'Unavailable' };
const socialIcons = { instagram: IconInstagram, youtube: IconYouTube, tiktok: IconTikTok, linkedin: IconLinkedIn, imdb: IconIMDb, behance: IconBehance, website: IconGlobe, maps_business: IconPin, spotlight: IconStar, other: IconGlobe };

const TABS = ['Overview', 'Roles & Rates', 'Portfolio', 'External Presence'];

export default function TalentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authState.getUser();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getTalent(id).then(data => {
      setTalent(data);
    }).catch(err => {
      console.error('Failed to load talent:', err);
      setError(err.message);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page" style={{ maxWidth: 900 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-md)' }}>
          <IconChevronLeft size={16} /> Back
        </button>
        <SkeletonLoader variant="profile" />
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="page" style={{ maxWidth: 900 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-md)' }}>
          <IconChevronLeft size={16} /> Back
        </button>
        <div className="empty-state">
          <div className="empty-state-icon"><IconAlertCircle size={48} style={{ color: 'var(--text-muted)' }} /></div>
          <h3>Talent not found</h3>
          <p>{error || 'This profile may have been removed or is no longer public.'}</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === talent.userId;
  const initials = (talent.name || '').split(' ').map(n => n[0]).join('').substring(0, 2);
  const tier = talent.tier || 'unverified';
  const availability = talent.availability || 'available';
  const avatarUrl = talent.avatar ? `https://drive.google.com/thumbnail?id=${talent.avatar}&sz=w300` : null;
  const languages = typeof talent.languages === 'string' ? talent.languages.split(',').map(s => s.trim()) : (talent.languages || []);
  const roles = talent.roles || [];
  const skills = talent.skills || [];
  const media = talent.media || [];
  const socials = talent.socials || [];

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      {/* Back button */}
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-md)' }}>
        <IconChevronLeft size={16} /> Back
      </button>

      {/* Profile hero */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="avatar" style={{ width: 120, height: 120, fontSize: '2rem', flexShrink: 0 }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={talent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.5rem' }}>{talent.name}</h1>
              <IconVerified size={22} style={{ color: tierColors[tier] }} />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>{tierLabels[tier]}</p>
            <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--text-secondary)' }}><IconPin size={14} />{talent.location || 'Unknown'}</span>
              {languages.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--text-secondary)' }}><IconGlobe size={14} />{languages.join(', ')}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
              <span className={`chip ${availPills[availability] || 'pill-available'}`}>{availLabels[availability] || 'Available'}</span>
              {talent.travel && <span className="chip chip-genre" style={{ textTransform: 'capitalize' }}>{String(talent.travel).replace(/_/g, ' ')}</span>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Add to Project</button>
              <button className="btn btn-secondary btn-sm"><IconShare size={14} /> Share</button>
              {isOwner && <button className="btn btn-secondary btn-sm"><IconEdit size={14} /> Edit Profile</button>}
              {isOwner && <button className="btn btn-ghost btn-sm"><IconEyeOff size={14} /> Hide Profile</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-xl)' }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{
              padding: '12px 20px', fontSize: '0.875rem', fontWeight: tab === i ? 600 : 400,
              color: tab === i ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderBottom: tab === i ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none', border: 'none', borderBottomStyle: 'solid',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}>{t}</button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 0 && (
        <div>
          <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>About</h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {talent.bio || 'No bio provided yet.'}
            </p>
          </div>
          {skills.length > 0 && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Skills</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {skills.map((s, i) => <span key={i} className="chip chip-genre">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Roles & Rates */}
      {tab === 1 && (
        <div>
          {roles.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No roles listed yet.</p>
            </div>
          ) : roles.map((r, i) => {
            const roleName = r.ROLE_NAME || r.name || 'Unknown Role';
            const isPrimary = r.IS_PRIMARY || r.isPrimary;
            const exp = r.EXPERIENCE_YEARS || r.experience;
            const rateVis = r.RATE_VISIBILITY || r.rateVisibility;
            const rateType = r.RATE_TYPE || r.rateType;
            const rateMin = r.RATE_MIN || r.rateMin;
            const rateMax = r.RATE_MAX || r.rateMax;
            const currency = r.RATE_CURRENCY || r.rateCurrency;
            return (
              <div key={i} className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4>{roleName}</h4>
                      {isPrimary && <span className="chip" style={{ background: 'var(--gold-dim)', color: 'var(--gold)', fontSize: '0.6875rem' }}>Primary</span>}
                    </div>
                    {exp && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>{exp} years experience</p>}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {rateVis === 'range_public' && rateMin && rateMax && (
                    <p><strong>Rate:</strong> {currency} {Number(rateMin).toLocaleString()} – {Number(rateMax).toLocaleString()} / {rateType}</p>
                  )}
                  {rateVis === 'exact_public' && rateMin && (
                    <p><strong>Rate:</strong> {currency} {Number(rateMin).toLocaleString()} / {rateType}</p>
                  )}
                  {rateVis === 'exact_private' && <p><strong>Rate:</strong> Shared on request</p>}
                  {rateVis === 'hidden' && <p><strong>Rate:</strong> Hidden</p>}
                  {!rateVis && <p><strong>Rate:</strong> Open</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Portfolio */}
      {tab === 2 && (
        <div>
          {media.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No portfolio items yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              {media.map((m, i) => {
                const mediaType = m.MEDIA_TYPE || m.type;
                const caption = m.CAPTION || m.caption;
                const fileId = m.FILE_ID || m.fileId;
                const thumbUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w300` : null;
                const linkUrl = m.URL || m.url;
                return (
                  <div key={i} className="card card-hoverable" style={{ overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '1', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      {thumbUrl
                        ? <img src={thumbUrl} alt={caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : linkUrl
                          ? <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}><IconExternalLink size={48} /></a>
                          : <IconImage size={48} />}
                    </div>
                    <div style={{ padding: 'var(--space-md)' }}>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{caption || 'Untitled'}</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'capitalize' }}>{mediaType}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {isOwner && media.filter(m => (m.MEDIA_TYPE || m.type) === 'image').length < 5 && (
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-lg)' }}>
              <IconPlus size={14} /> Upload Image ({5 - media.filter(m => (m.MEDIA_TYPE || m.type) === 'image').length} remaining)
            </button>
          )}
        </div>
      )}

      {/* Tab: External Presence */}
      {tab === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
          {socials.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No external presence linked yet.</p>
            </div>
          ) : socials.map((s, i) => {
            const platform = s.PLATFORM || s.platform || 'other';
            const handle = s.HANDLE || s.handle;
            const url = s.URL || s.url;
            const Icon = socialIcons[platform] || IconGlobe;
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="card card-hoverable" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', textDecoration: 'none' }}>
                <Icon size={24} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>{platform.replace(/_/g, ' ')}</p>
                  <p className="truncate" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{handle}</p>
                </div>
                <IconExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

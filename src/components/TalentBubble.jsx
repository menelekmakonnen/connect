/**
 * ICUNI Connect — Talent Bubble (Context Preview)
 * Desktop: right drawer (45% width) | Mobile: bottom sheet (85% height)
 * The core interaction — this is what makes the product feel elite.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconX, IconPlus, IconEye, IconCopy, IconPin, IconVerified, IconStar,
  IconCamera, IconScissors, IconClapperboard, IconMic, IconPalette,
  IconInstagram, IconYouTube, IconTikTok, IconLinkedIn, IconIMDb,
  IconBehance, IconGlobe, IconMail, IconPhone, IconExternalLink,
  IconChevronRight, IconImage
} from '../lib/icons';

const tierColors = { unverified: 'var(--tier-unverified)', profile: 'var(--tier-profile)', work: 'var(--tier-work)', pro: 'var(--tier-pro)' };
const tierLabels = { unverified: 'Unverified', profile: 'Profile Verified', work: 'Work Verified', pro: 'Pro Verified' };
const availLabels = { available: 'Available', limited: 'Limited Availability', unavailable: 'Unavailable' };
const availPills = { available: 'pill-available', limited: 'pill-limited', unavailable: 'pill-unavailable' };

const socialIcons = {
  instagram: IconInstagram, tiktok: IconTikTok, youtube: IconYouTube,
  linkedin: IconLinkedIn, imdb: IconIMDb, behance: IconBehance,
  website: IconGlobe, maps_business: IconPin, spotlight: IconStar, other: IconGlobe,
};

const socialColors = {
  instagram: '#E4405F', tiktok: '#000000', youtube: '#FF0000',
  linkedin: '#0A66C2', imdb: '#F5C518', behance: '#1769FF',
  website: 'var(--accent)', maps_business: '#4285F4', spotlight: '#FFD700',
};

export default function TalentBubble({ talent, onClose, onAddToProject }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  if (!talent) return null;
  const initials = talent.name.split(' ').map(n => n[0]).join('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/talent/${talent.id}`);
    // TODO: toast "Copied!"
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="drawer-panel animate-slide-right" ref={panelRef}>
        {/* Header */}
        <div className="drawer-header">
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Talent Preview</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close"><IconX size={18} /></button>
        </div>

        {/* Body */}
        <div className="drawer-body" style={{ padding: 0 }}>
          {/* Profile hero */}
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-md)', width: 96, height: 96, fontSize: '1.75rem' }}>
              {talent.avatar ? <img src={talent.avatar} alt={talent.name} /> : initials}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{talent.name}</h2>
              <IconVerified size={18} style={{ color: tierColors[talent.tier] }} />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
              {tierLabels[talent.tier]}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
              <IconPin size={14} />{talent.location}
            </div>
            <span className={`chip ${availPills[talent.availability]}`}>{availLabels[talent.availability]}</span>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
            <button className="btn btn-primary btn-sm" onClick={() => onAddToProject?.(talent)} style={{ fontSize: '0.75rem' }}>
              <IconPlus size={14} /> Add to Project
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/app/talent/${talent.id}`)} style={{ fontSize: '0.75rem' }}>
              <IconEye size={14} /> Full Profile
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleCopyLink} style={{ fontSize: '0.75rem' }}>
              <IconCopy size={14} /> Copy Link
            </button>
          </div>

          {/* Roles & Skills */}
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
            <h6 style={{ marginBottom: 'var(--space-md)' }}>Roles</h6>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
              {(talent.roles || []).map((r, i) => (
                <span key={i} className="chip chip-role">{r}</span>
              ))}
            </div>

            {talent.skills && talent.skills.length > 0 && (
              <>
                <h6 style={{ marginBottom: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>Skills</h6>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {talent.skills.map((s, i) => (
                    <span key={i} className="chip chip-genre">{s}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Rates snippet */}
          {talent.rateDisplay && (
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
              <h6 style={{ marginBottom: 'var(--space-sm)' }}>Rates</h6>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {talent.rateDisplay}
              </p>
            </div>
          )}

          {/* Media strip */}
          {talent.media && talent.media.length > 0 && (
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
              <h6 style={{ marginBottom: 'var(--space-md)' }}>Portfolio</h6>
              <div className="hide-scrollbar" style={{
                display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto',
                paddingBottom: 'var(--space-sm)',
              }}>
                {talent.media.map((m, i) => (
                  <div key={i} style={{
                    width: 100, height: 100, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass)', flexShrink: 0, overflow: 'hidden',
                    border: '1px solid var(--border)',
                  }}>
                    {m.type === 'image' && m.url ? (
                      <img src={m.url} alt={m.caption || 'Portfolio'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <IconImage size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Presence */}
          <div style={{ padding: 'var(--space-lg)' }}>
            <h6 style={{ marginBottom: 'var(--space-md)' }}>External Presence</h6>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              {(talent.socials || []).map((s, i) => {
                const Icon = socialIcons[s.platform] || IconGlobe;
                const color = socialColors[s.platform] || 'var(--text-secondary)';
                return (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-glass)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500,
                      textDecoration: 'none', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <Icon size={16} />{s.handle || s.platform}
                    <IconExternalLink size={12} style={{ opacity: 0.5 }} />
                  </a>
                );
              })}
              {(!talent.socials || talent.socials.length === 0) && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No external presence linked yet.</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {talent.bio && (
            <div style={{ padding: '0 var(--space-lg) var(--space-xl)' }}>
              <h6 style={{ marginBottom: 'var(--space-sm)' }}>About</h6>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {talent.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

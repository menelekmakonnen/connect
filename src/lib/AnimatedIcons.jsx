/**
 * ICUNI Connect — Animated SVG Icon System
 * Interactive icons with hover, click, and active states.
 * Uses CSS classes for state-driven animations.
 *
 * Usage:
 *   <AnimIcon icon="talent-search" size={48} />
 *   <AnimIcon icon="clapperboard" size={32} active />
 */
import React, { useState, useCallback } from 'react';

// Base wrapper with interaction state management
function AnimIcon({ icon, size = 40, active = false, className = '', onClick, ...props }) {
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = useCallback(() => setPressed(true), []);
  const handleMouseUp = useCallback(() => setPressed(false), []);
  const handleMouseLeave = useCallback(() => setPressed(false), []);

  const stateClass = [
    'anim-icon',
    active ? 'anim-icon--active' : '',
    pressed ? 'anim-icon--pressed' : '',
    className,
  ].filter(Boolean).join(' ');

  const IconComponent = ICON_MAP[icon];
  if (!IconComponent) return null;

  return (
    <div
      className={stateClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      {...props}
    >
      <IconComponent size={size} active={active} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SVG ICON DEFINITIONS
// Each icon is a function component receiving { size, active }
// ═══════════════════════════════════════════════════════

// ── Talent Search (Magnifying glass + person) ──────────
const TalentSearch = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <circle className="anim-icon-ring" cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />
    <circle className="anim-icon-main" cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0} />
    <line className="anim-icon-handle" x1="27" y1="27" x2="38" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle className="anim-icon-detail" cx="18" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path className="anim-icon-detail" d="M14 23c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Sparkle */}
    <circle className="anim-icon-sparkle" cx="33" cy="10" r="1.5" fill="currentColor" opacity="0" />
    <circle className="anim-icon-sparkle anim-icon-sparkle-2" cx="38" cy="15" r="1" fill="currentColor" opacity="0" />
  </svg>
);

// ── Deal Memo (Document + pen) ─────────────────────────
const DealMemo = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <rect className="anim-icon-main" x="8" y="4" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.08 : 0} />
    {/* Lines on doc */}
    <line className="anim-icon-detail anim-icon-line-1" x1="14" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line className="anim-icon-detail anim-icon-line-2" x1="14" y1="19" x2="24" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line className="anim-icon-detail anim-icon-line-3" x1="14" y1="25" x2="22" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    {/* Pen */}
    <path className="anim-icon-pen" d="M34 18l6-6 4 4-6 6-4 1 0-5z" stroke="currentColor" strokeWidth="1.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.2 : 0} strokeLinejoin="round" />
    {/* Checkmark that appears */}
    <polyline className="anim-icon-check" points="14 30 18 34 26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
  </svg>
);

// ── Production Timeline (Calendar + phases) ────────────
const Timeline = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <rect className="anim-icon-main" x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.08 : 0} />
    <line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    {/* Phase blocks */}
    <rect className="anim-icon-phase anim-icon-phase-1" x="8" y="22" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.25" />
    <rect className="anim-icon-phase anim-icon-phase-2" x="14" y="29" width="14" height="5" rx="1.5" fill="currentColor" opacity="0.35" />
    <rect className="anim-icon-phase anim-icon-phase-3" x="24" y="22" width="16" height="5" rx="1.5" fill="currentColor" opacity="0.2" />
    {/* Calendar pins */}
    <line className="anim-icon-detail" x1="14" y1="5" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line className="anim-icon-detail" x1="34" y1="5" x2="34" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Dot indicators */}
    <circle className="anim-icon-dot" cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
    <circle className="anim-icon-dot" cx="16" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
    <circle className="anim-icon-dot" cx="22" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

// ── Analytics (Chart + trend line) ─────────────────────
const Analytics = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    {/* Bars */}
    <rect className="anim-icon-bar anim-icon-bar-1" x="6" y="28" width="6" height="14" rx="1" fill="currentColor" opacity="0.2" />
    <rect className="anim-icon-bar anim-icon-bar-2" x="15" y="20" width="6" height="22" rx="1" fill="currentColor" opacity="0.3" />
    <rect className="anim-icon-bar anim-icon-bar-3" x="24" y="14" width="6" height="28" rx="1" fill="currentColor" opacity="0.4" />
    <rect className="anim-icon-bar anim-icon-bar-4" x="33" y="8" width="6" height="34" rx="1" fill="currentColor" opacity={active ? 0.6 : 0.5} />
    {/* Trend line */}
    <polyline className="anim-icon-trend" points="9 28 18 20 27 14 36 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
    {/* Arrow tip */}
    <polyline className="anim-icon-arrow" points="32 8 38 6 36 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0" />
    {/* Axes */}
    <line x1="4" y1="42" x2="44" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
    <line x1="4" y1="6" x2="4" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
  </svg>
);

// ── Verified Shield ────────────────────────────────────
const VerifiedShield = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <path className="anim-icon-main" d="M24 4L6 12v12c0 11 8 18 18 20 10-2 18-9 18-20V12L24 4z" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0} />
    {/* Inner shield glow */}
    <path className="anim-icon-glow" d="M24 10L12 16v8c0 8 5.5 13 12 14.5 6.5-1.5 12-6.5 12-14.5v-8L24 10z" fill="currentColor" opacity="0.05" />
    {/* Check */}
    <polyline className="anim-icon-check" points="16 24 22 30 34 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Star bursts */}
    <circle className="anim-icon-sparkle" cx="38" cy="10" r="1.5" fill="currentColor" opacity="0" />
    <circle className="anim-icon-sparkle anim-icon-sparkle-2" cx="10" cy="8" r="1" fill="currentColor" opacity="0" />
  </svg>
);

// ── Globe / Africa ─────────────────────────────────────
const GlobeAfrica = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <circle className="anim-icon-main" cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.08 : 0} />
    {/* Longitude/latitude lines */}
    <ellipse className="anim-icon-orbit" cx="24" cy="24" rx="8" ry="18" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    {/* Simplified Africa shape */}
    <path className="anim-icon-continent" d="M22 12c2 0 4 1 5 3l-1 4 3 2 1 5-2 4-4 3-5-1-3-4 0-5 2-3 1-5 3-3z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
    {/* Pin */}
    <circle className="anim-icon-pin" cx="24" cy="22" r="2" fill="currentColor" opacity="0.6" />
    {/* Orbit ring */}
    <ellipse className="anim-icon-ring-orbit" cx="24" cy="24" rx="22" ry="6" stroke="currentColor" strokeWidth="0.8" opacity="0" strokeDasharray="4 3" />
  </svg>
);

// ── Creative Roles (Theater masks) ─────────────────────
const TheaterMasks = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    {/* Happy mask */}
    <path className="anim-icon-mask-happy" d="M10 10c0-3 2-5 5-5h10c3 0 5 2 5 5v8c0 6-4.5 11-10 11s-10-5-10-11V10z" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0} />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="24" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
    <path className="anim-icon-smile" d="M15 20c1.5 3 5.5 3 7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Sad mask (offset behind) */}
    <path className="anim-icon-mask-sad" d="M24 18c0-3 2-5 5-5h10c3 0 5 2 5 5v8c0 6-4.5 11-10 11s-10-5-10-11V18z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" fill="none" />
    <circle cx="30" cy="22" r="1" fill="currentColor" opacity="0.3" />
    <circle cx="38" cy="22" r="1" fill="currentColor" opacity="0.3" />
    <path d="M29 30c1.5-2.5 5.5-2.5 7 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" fill="none" />
  </svg>
);

// ── Tags / Aliases ─────────────────────────────────────
const TagStack = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    {/* Back tag */}
    <path className="anim-icon-tag-back" d="M12 10l8-6h16l8 8v16l-8 8H20l-8-8V10z" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none" />
    {/* Front tag */}
    <path className="anim-icon-main" d="M8 14l8-6h14l8 8v14l-8 8H16l-8-8V14z" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0} />
    {/* Tag hole */}
    <circle className="anim-icon-detail" cx="22" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Hash lines */}
    <line className="anim-icon-detail" x1="16" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <line className="anim-icon-detail" x1="18" y1="29" x2="28" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

// ── Clapperboard (Film production) ─────────────────────
const Clapperboard = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    {/* Board body */}
    <rect className="anim-icon-main" x="4" y="16" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.08 : 0} />
    {/* Clapper top */}
    <path className="anim-icon-clapper" d="M4 16L12 4h24l8 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    {/* Diagonal stripes on clapper */}
    <line className="anim-icon-stripe" x1="14" y1="4" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <line className="anim-icon-stripe" x1="22" y1="4" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <line className="anim-icon-stripe" x1="30" y1="4" x2="36" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    {/* Text lines on board */}
    <line x1="10" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <line x1="10" y1="30" x2="22" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <line x1="10" y1="36" x2="18" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
  </svg>
);

// ── Brand Logo (IC Monogram) ───────────────────────────
const BrandLogo = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg anim-icon-brand">
    <defs>
      <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E8A838" />
        <stop offset="100%" stopColor="#D4922E" />
      </linearGradient>
    </defs>
    <rect className="anim-icon-main" width="48" height="48" rx="14" fill="url(#brand-grad)" />
    {/* I */}
    <line x1="16" y1="14" x2="16" y2="34" stroke="#000" strokeWidth="4" strokeLinecap="round" />
    <line x1="12" y1="14" x2="20" y2="14" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="34" x2="20" y2="34" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
    {/* C */}
    <path d="M38 16c-2-3-5-4-8-4-6 0-10 5-10 12s4 12 10 12c3 0 6-1 8-4" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Shine */}
    <rect className="anim-icon-shine" x="0" y="0" width="12" height="48" rx="6" fill="rgba(255,255,255,0.15)" transform="rotate(-20 24 24)" opacity="0" />
  </svg>
);

// ── Star Rating ────────────────────────────────────────
const StarBurst = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <polygon className="anim-icon-main" points="24,4 29.5,16 42,18 33,27 35.5,40 24,34 12.5,40 15,27 6,18 18.5,16" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} strokeLinejoin="round" />
    {/* Inner star glow */}
    <polygon className="anim-icon-glow" points="24,12 27,20 35,21 29,27 31,35 24,31 17,35 19,27 13,21 21,20" fill="currentColor" opacity="0.08" />
    {/* Sparkles */}
    <circle className="anim-icon-sparkle" cx="42" cy="8" r="1.5" fill="currentColor" opacity="0" />
    <circle className="anim-icon-sparkle anim-icon-sparkle-2" cx="6" cy="10" r="1" fill="currentColor" opacity="0" />
    <circle className="anim-icon-sparkle anim-icon-sparkle-3" cx="44" cy="36" r="1.2" fill="currentColor" opacity="0" />
  </svg>
);

// ── Film Reel ──────────────────────────────────────────
const FilmReel = ({ size, active }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="anim-icon-svg">
    <circle className="anim-icon-main" cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.05 : 0} />
    <circle className="anim-icon-detail" cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Sprocket holes */}
    <circle className="anim-icon-sprocket" cx="24" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle className="anim-icon-sprocket" cx="38" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle className="anim-icon-sprocket" cx="38" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle className="anim-icon-sprocket" cx="24" cy="40" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle className="anim-icon-sprocket" cx="10" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle className="anim-icon-sprocket" cx="10" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    {/* Film strip tail */}
    <path className="anim-icon-film-tail" d="M42 24h4c0 0 0-4 -2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
  </svg>
);

// ═══ ICON REGISTRY ═══
const ICON_MAP = {
  'talent-search': TalentSearch,
  'deal-memo': DealMemo,
  'timeline': Timeline,
  'analytics': Analytics,
  'verified': VerifiedShield,
  'globe': GlobeAfrica,
  'masks': TheaterMasks,
  'tags': TagStack,
  'clapperboard': Clapperboard,
  'brand': BrandLogo,
  'star': StarBurst,
  'film-reel': FilmReel,
};

export default AnimIcon;
export { ICON_MAP };

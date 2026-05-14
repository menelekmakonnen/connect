/**
 * ICUNI Connect — Custom SVG Icon Library
 * 80+ hand-crafted icons for the film/creative industry.
 * Adapted from PrintShop icons.js + OSA NavIcons.jsx
 */
import React from 'react';

const I = ({ children, size = 20, className = '', strokeWidth = 1.8, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={`ic-icon ${className}`} {...props}>{children}</svg>
);

// ── Navigation ──
export const IconDashboard = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
  </I>
);

export const IconTalents = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <circle cx="9" cy="7" r="3" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0}/>
    <path d="M3 21v-1a6 6 0 0112 0v1"/>
    <circle cx="17" cy="8" r="2.5"/><path d="M21 21v-.5a4 4 0 00-4-4"/>
  </I>
);

export const IconProjects = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
    {active && <rect x="11" y="12" width="8" height="3" rx="0.5" fill="currentColor" fillOpacity="0.15"/>}
  </I>
);

export const IconRequests = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0}/>
  </I>
);

export const IconInsights = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <path d="M3 3v18h18"/><path d="M7 16l4-5 4 3 5-7"/>
    {active && <circle cx="20" cy="7" r="1.5" fill="currentColor" stroke="none"/>}
  </I>
);

export const IconSettings = ({ size, active, ...p }) => (
  <I size={size} strokeWidth={active ? 2.2 : 1.8} {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </I>
);

// ── Actions ──
export const IconPlus = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M12 5v14M5 12h14"/></I>);
export const IconCheck = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="20 6 9 17 4 12"/></I>);
export const IconX = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M18 6L6 18M6 6l12 12"/></I>);
export const IconEdit = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></I>);
export const IconTrash = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></I>);
export const IconSearch = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></I>);
export const IconFilter = ({ size = 20, ...p }) => (<I size={size} {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></I>);
export const IconSort = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M3 6h18M6 12h12M9 18h6"/></I>);
export const IconSend = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></I>);
export const IconCopy = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></I>);
export const IconShare = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></I>);
export const IconRefresh = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></I>);
export const IconDownload = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></I>);
export const IconUpload = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></I>);
export const IconChevronLeft = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="15 18 9 12 15 6"/></I>);
export const IconChevronRight = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="9 18 15 12 9 6"/></I>);
export const IconChevronDown = ({ size = 20, ...p }) => (<I size={size} {...p}><polyline points="6 9 12 15 18 9"/></I>);
export const IconMoreH = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></I>);
export const IconMoreV = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></I>);
export const IconExternalLink = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></I>);
export const IconEye = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>);
export const IconEyeOff = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></I>);

// ── Status ──
export const IconClock = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></I>);
export const IconCheckCircle = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></I>);
export const IconAlertCircle = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></I>);
export const IconLoader = ({ size = 20, className = '', ...p }) => (<I size={size} className={`animate-spin ${className}`} {...p}><path d="M21 12a9 9 0 11-6.219-8.56"/></I>);
export const IconLock = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></I>);

// ── Objects ──
export const IconUser = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></I>);
export const IconUsers = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></I>);
export const IconMail = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></I>);
export const IconPhone = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></I>);
export const IconPin = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></I>);
export const IconCalendar = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></I>);
export const IconStar = ({ size = 20, ...p }) => (<I size={size} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></I>);
export const IconHeart = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></I>);
export const IconTrophy = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></I>);
export const IconKey = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></I>);
export const IconGlobe = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></I>);
export const IconLink = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></I>);
export const IconBell = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></I>);
export const IconLogout = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></I>);
export const IconImage = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></I>);
export const IconPlay = ({ size = 20, ...p }) => (<I size={size} {...p}><polygon points="5 3 19 12 5 21 5 3"/></I>);

// ── Film/Creative Industry ──
export const IconCamera = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></I>);
export const IconFilm = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></I>);
export const IconClapperboard = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><path d="M4 11l4.5-7h7L20 11"/><path d="M8.5 4L13 11M11 4l4.5 7"/><path d="M2 11h20"/></I>);
export const IconScissors = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></I>);
export const IconPalette = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></I>);
export const IconMic = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></I>);
export const IconMusic = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></I>);
export const IconSpotlight = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M12 2L8 10h8L12 2z"/><path d="M8 10l-4 12h16l-4-12"/><path d="M12 10v12"/></I>);
export const IconDrone = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><rect x="8" y="8" width="8" height="6" rx="1"/><path d="M5 7v1h4M19 7v1h-4"/><path d="M10 14v3M14 14v3M8 17h8"/></I>);
export const IconWardrobe = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M12 2L8 6h8l-4-4z"/><path d="M8 6v2a4 4 0 008 0V6"/><line x1="12" y1="10" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></I>);

// ── Social/External Presence ──
export const IconInstagram = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></I>);
export const IconYouTube = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></I>);
export const IconTikTok = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></I>);
export const IconLinkedIn = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></I>);
export const IconIMDb = ({ size = 20, ...p }) => (<I size={size} {...p}><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M6 9v6M9 9v6M9 12h2M14 9l1.5 6L17 9M19 9v6"/></I>);
export const IconBehance = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M3 9h4a2 2 0 010 4H3V9zM3 13h4.5a2.5 2.5 0 010 5H3v-5z"/><path d="M14 13c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"/><path d="M14 13h6"/><path d="M14 7h6"/></I>);

// ── Verification & Tier ──
export const IconVerified = ({ size = 20, ...p }) => (
  <I size={size} {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" fillOpacity="0.15"/>
    <polyline points="9 12 11 14 15 10" strokeWidth="2"/>
  </I>
);

export const IconShield = ({ size = 20, ...p }) => (
  <I size={size} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>
);

// ── Theme ──
export const IconSun = ({ size = 20, ...p }) => (<I size={size} {...p}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></I>);
export const IconMoon = ({ size = 20, ...p }) => (<I size={size} {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></I>);


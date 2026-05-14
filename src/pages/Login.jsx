/**
 * ICUNI Connect — Welcome Page (V3 Overhaul)
 * 
 * Design DNA:
 *   X/Twitter  → Bold full-bleed brand mark, black canvas, stark contrast
 *   Instagram  → Gradient mesh, smooth transitions, phone-first
 *   LinkedIn   → Professional hero with ambient imagery
 *   Snapchat   → Playful micro-animations, bold typography
 *
 * Split layout: Immersive brand experience (left) + Glassmorphic auth (right)
 * Zero emojis. Custom SVG icons only. Per ICUNI Build Standards.
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/theme';
import { authState, loginWithPin, register, setPin } from '../lib/api';
import {
  IconSun, IconMoon, IconMail, IconPhone, IconKey,
  IconChevronLeft, IconCheck, IconUser, IconClapperboard, IconLoader
} from '../lib/icons';

const STEPS = { WELCOME: 'welcome', PIN: 'pin', SETUP_NAME: 'setup_name', SETUP_PIN: 'setup_pin' };

// ── Hero words with gradient pairs ─────────────────────────
const HERO_WORDS = [
  { word: 'Discover', gradient: 'linear-gradient(135deg, #00ffd5, #00b4d8)' },
  { word: 'Assemble', gradient: 'linear-gradient(135deg, #E8A838, #ff6b35)' },
  { word: 'Create',   gradient: 'linear-gradient(135deg, #c084fc, #818cf8)' },
  { word: 'Produce',  gradient: 'linear-gradient(135deg, #60a5fa, #38bdf8)' },
  { word: 'Connect',  gradient: 'linear-gradient(135deg, #ff6b9d, #f472b6)' },
];

// ── Floating role orbs ─────────────────────────────────────
const ROLE_ORBS = [
  { role: 'Director', initials: 'DR', x: 12, y: 18, delay: 0, size: 52 },
  { role: 'DP', initials: 'DP', x: 78, y: 14, delay: 1.2, size: 44 },
  { role: 'Editor', initials: 'ED', x: 85, y: 72, delay: 2.4, size: 48 },
  { role: 'Sound', initials: 'SN', x: 18, y: 76, delay: 0.8, size: 40 },
  { role: 'Gaffer', initials: 'GF', x: 50, y: 85, delay: 3.0, size: 36 },
  { role: 'Makeup', initials: 'MU', x: 72, y: 42, delay: 1.8, size: 42 },
  { role: 'VFX', initials: 'VX', x: 28, y: 48, delay: 2.8, size: 38 },
  { role: 'Actor', initials: 'AC', x: 60, y: 22, delay: 0.4, size: 46 },
];

// ── Stats for social proof ─────────────────────────────────
const STATS = [
  { value: '66+', label: 'Creative Roles' },
  { value: '10k+', label: 'Professionals' },
  { value: '500+', label: 'Productions' },
];

// ── Animated Mesh Background ───────────────────────────────
function MeshGradient() {
  return (
    <div className="wl-mesh" aria-hidden="true">
      <div className="wl-mesh-orb wl-mesh-orb--1" />
      <div className="wl-mesh-orb wl-mesh-orb--2" />
      <div className="wl-mesh-orb wl-mesh-orb--3" />
      <div className="wl-mesh-orb wl-mesh-orb--4" />
      <div className="wl-mesh-noise" />
    </div>
  );
}

// ── Floating Role Orbs ─────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="wl-orbs" aria-hidden="true">
      {ROLE_ORBS.map((orb, i) => (
        <div
          key={i}
          className="wl-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            animationDelay: `${orb.delay}s`,
          }}
          title={orb.role}
        >
          <span className="wl-orb-initials">{orb.initials}</span>
          <span className="wl-orb-label">{orb.role}</span>
        </div>
      ))}
    </div>
  );
}

// ── Giant SVG Brand Mark ───────────────────────────────────
function BrandMark() {
  return (
    <div className="wl-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="wl-brand-svg">
        <defs>
          <linearGradient id="brandGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8A838" />
            <stop offset="50%" stopColor="#D4922E" />
            <stop offset="100%" stopColor="#C17D24" />
          </linearGradient>
          <linearGradient id="brandShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="url(#brandGold)" strokeWidth="2.5" opacity="0.4" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="url(#brandGold)" strokeWidth="1" opacity="0.2" />
        {/* IC letters */}
        <text x="100" y="118" textAnchor="middle" fill="url(#brandGold)" fontFamily="'Inter','Outfit',sans-serif" fontSize="72" fontWeight="900" letterSpacing="-3">
          IC
        </text>
        {/* Subtle shine overlay */}
        <rect x="0" y="0" width="200" height="200" fill="url(#brandShine)" className="wl-brand-shine" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function Login() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  // Auth state
  const [step, setStep] = useState(STEPS.WELCOME);
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin_] = useState(['', '', '', '']);
  const [setupPin, setSetupPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const setupPinRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmPinRefs = [useRef(), useRef(), useRef(), useRef()];

  // Hero animation
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroExiting, setHeroExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroExiting(true);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % HERO_WORDS.length);
        setHeroExiting(false);
      }, 400);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Focus PIN inputs
  useEffect(() => {
    if (step === STEPS.PIN) setTimeout(() => pinRefs[0].current?.focus(), 100);
    if (step === STEPS.SETUP_PIN) setTimeout(() => setupPinRefs[0].current?.focus(), 100);
  }, [step]);

  // ── Auth handlers ────────────────────────────────────────
  const handleIdentify = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) { setError('Please enter your email or phone number.'); return; }
    setLoading(true); setError('');
    try {
      const res = await register(identifier.trim(), '');
      setUserId(res.userId); setUserName(res.name);
      if (res.exists) { setStep(res.hasPin ? STEPS.PIN : STEPS.SETUP_PIN); }
      else { setStep(STEPS.SETUP_NAME); }
    } catch (err) { setError(err.message || 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  const handleSetName = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError(''); setStep(STEPS.SETUP_PIN);
  };

  const handlePinChange = (index, value, refs, setter, currentPin) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...currentPin]; newPin[index] = value; setter(newPin);
    if (value && index < 3) refs[index + 1].current?.focus();
  };

  const handlePinKeyDown = (index, e, refs, currentPin, setter) => {
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs[index - 1].current?.focus();
      const newPin = [...currentPin]; newPin[index - 1] = ''; setter(newPin);
    }
  };

  const handlePinLogin = useCallback(async () => {
    const pinStr = pin.join('');
    if (pinStr.length !== 4) return;
    setLoading(true); setError('');
    try {
      const res = await loginWithPin(identifier.trim(), pinStr);
      authState.setSession(res.token, res.user);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Incorrect PIN.');
      setPin_(['', '', '', '']); pinRefs[0].current?.focus();
    } finally { setLoading(false); }
  }, [pin, identifier, navigate]);

  useEffect(() => { if (step === STEPS.PIN && pin.every(d => d !== '')) handlePinLogin(); }, [pin, step, handlePinLogin]);

  const handleSetupComplete = useCallback(async () => {
    const confirmStr = confirmPin.join('');
    if (confirmStr.length !== 4) return;
    const pinStr = setupPin.join('');
    if (pinStr !== confirmStr) {
      setError('PINs don\'t match.'); setConfirmPin(['', '', '', '']);
      confirmPinRefs[0].current?.focus(); return;
    }
    setLoading(true); setError('');
    try {
      const res = await setPin(userId, pinStr);
      authState.setSession(res.token, res.user);
      navigate('/app/dashboard');
    } catch (err) { setError(err.message || 'Failed to set PIN.'); }
    finally { setLoading(false); }
  }, [confirmPin, setupPin, userId, navigate]);

  useEffect(() => {
    if (step === STEPS.SETUP_PIN && !showConfirm && setupPin.every(d => d !== '')) {
      setError(''); setShowConfirm(true);
      setTimeout(() => confirmPinRefs[0].current?.focus(), 100);
    }
  }, [setupPin, step, showConfirm]);

  useEffect(() => {
    if (step === STEPS.SETUP_PIN && showConfirm && confirmPin.every(d => d !== '')) handleSetupComplete();
  }, [confirmPin, showConfirm, step, handleSetupComplete]);

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      authState.setSession('demo-token', {
        id: 'USR-demo001', name: 'Kwame Mensah', email: 'kwame@icuni.org',
        role: 'PM', avatar: null, phone: '', hasPin: true,
      });
      navigate('/app/dashboard');
    }, 600);
  };

  const resetToStart = () => {
    setError(''); setPin_(['', '', '', '']); setSetupPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']); setShowConfirm(false);
    setStep(STEPS.WELCOME);
  };

  // ── PIN Input Component ──────────────────────────────────
  const PinBoxes = ({ values, refs, disabled }) => (
    <div className="wl-pin-row">
      {values.map((digit, i) => (
        <input key={i} ref={refs[i]} type="password" inputMode="numeric" maxLength={1}
          value={digit} disabled={disabled}
          onChange={e => handlePinChange(i, e.target.value, refs, (v) => {
            if (refs === pinRefs) setPin_(v);
            else if (refs === setupPinRefs) setSetupPin(v);
            else setConfirmPin(v);
          }, values)}
          onKeyDown={e => handlePinKeyDown(i, e, refs, values, (v) => {
            if (refs === pinRefs) setPin_(v);
            else if (refs === setupPinRefs) setSetupPin(v);
            else setConfirmPin(v);
          })}
          className="wl-pin-box"
        />
      ))}
    </div>
  );

  const currentHero = HERO_WORDS[heroIndex];

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div className="wl-page">
      <MeshGradient />

      {/* Theme toggle */}
      <button className="wl-theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
      </button>

      {/* ═══ LEFT: Immersive Brand Experience ═══ */}
      <div className="wl-brand-side">
        <FloatingOrbs />
        <BrandMark />

        <div className="wl-brand-content">
          {/* Wordmark */}
          <h1 className="wl-wordmark">ICUNI Connect</h1>
          <p className="wl-tagline">Ghana's Creative Talent Directory</p>

          {/* Hero text rotator */}
          <div className="wl-hero-block">
            <span className="wl-hero-prefix">The smarter way to</span>
            <span
              className={`wl-hero-word ${heroExiting ? 'wl-hero-word--exit' : 'wl-hero-word--enter'}`}
              style={{ backgroundImage: currentHero.gradient }}
              key={heroIndex}
            >
              {currentHero.word}
            </span>
            <span className="wl-hero-suffix">world-class creative talent.</span>
          </div>

          {/* Social proof stats */}
          <div className="wl-stats">
            {STATS.map((s, i) => (
              <div key={i} className="wl-stat">
                <span className="wl-stat-value">{s.value}</span>
                <span className="wl-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT: Glassmorphic Auth Card ═══ */}
      <div className="wl-auth-side">
        <div className="wl-auth-card">
          {/* Mobile-only brand */}
          <div className="wl-mobile-brand">
            <svg viewBox="0 0 200 200" width="48" height="48">
              <defs>
                <linearGradient id="mbGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8A838" />
                  <stop offset="100%" stopColor="#C17D24" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#mbGold)" strokeWidth="6" />
              <text x="100" y="118" textAnchor="middle" fill="url(#mbGold)" fontFamily="'Inter',sans-serif" fontSize="72" fontWeight="900" letterSpacing="-3">IC</text>
            </svg>
            <h1 className="wl-mobile-wordmark">ICUNI Connect</h1>
          </div>

          {/* Back button */}
          {step !== STEPS.WELCOME && (
            <button className="wl-back-btn" onClick={resetToStart}>
              <IconChevronLeft size={14} /> Back
            </button>
          )}

          {/* ── STEP: Welcome ── */}
          {step === STEPS.WELCOME && (
            <div className="wl-step wl-step--enter">
              <div className="wl-step-header">
                <h2 className="wl-step-title">{isSignUp ? 'Get Started' : 'Welcome back'}</h2>
                <p className="wl-step-subtitle">{isSignUp
                  ? 'Create your account to join Ghana\'s creative network.'
                  : 'Sign in to your talent directory.'}</p>
              </div>

              <form onSubmit={handleIdentify} className="wl-form">
                <label className="wl-label">Email or phone number</label>
                <div className="wl-input-wrap">
                  <span className="wl-input-icon">
                    {identifier.includes('@') ? <IconMail size={16} /> : <IconPhone size={16} />}
                  </span>
                  <input
                    className="wl-input"
                    type="text"
                    placeholder="you@example.com"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setError(''); }}
                    autoFocus
                    autoComplete="email"
                  />
                </div>

                {error && <p className="wl-error">{error}</p>}

                <button type="submit" className="wl-btn wl-btn--primary" disabled={loading}>
                  {loading ? <span className="wl-spinner" /> : <IconKey size={16} />}
                  <span>{loading ? 'Looking you up...' : isSignUp ? 'Continue' : 'Sign in with PIN'}</span>
                </button>
              </form>

              {/* Toggle */}
              <p className="wl-toggle">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" className="wl-toggle-link" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>

              {/* Divider */}
              <div className="wl-divider"><span>or</span></div>

              {/* Demo */}
              <button className="wl-btn wl-btn--ghost" onClick={handleDemoLogin} disabled={loading}>
                <IconClapperboard size={16} />
                <span>Explore Demo</span>
              </button>

              <p className="wl-legal">By continuing, you agree to the ICUNI Connect Terms of Service and Privacy Policy.</p>
            </div>
          )}

          {/* ── STEP: Name ── */}
          {step === STEPS.SETUP_NAME && (
            <div className="wl-step wl-step--enter">
              <div className="wl-step-header">
                <div className="wl-step-icon"><IconUser size={24} /></div>
                <h2 className="wl-step-title">Welcome aboard!</h2>
                <p className="wl-step-subtitle">What should we call you?</p>
              </div>
              <form onSubmit={handleSetName} className="wl-form">
                <label className="wl-label">Full name</label>
                <div className="wl-input-wrap">
                  <span className="wl-input-icon"><IconUser size={16} /></span>
                  <input className="wl-input" placeholder="Your full name" value={name}
                    onChange={e => { setName(e.target.value); setError(''); }} autoFocus />
                </div>
                {error && <p className="wl-error">{error}</p>}
                <button type="submit" className="wl-btn wl-btn--primary">
                  <span>Continue to PIN Setup</span>
                </button>
              </form>
            </div>
          )}

          {/* ── STEP: Enter PIN ── */}
          {step === STEPS.PIN && (
            <div className="wl-step wl-step--enter">
              <div className="wl-step-header">
                <div className="wl-step-icon"><IconKey size={24} /></div>
                <h2 className="wl-step-title">Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}!</h2>
                <p className="wl-step-subtitle">Enter your 4-digit PIN to continue.</p>
              </div>
              <PinBoxes values={pin} refs={pinRefs} disabled={loading} />
              {error && <p className="wl-error">{error}</p>}
              {loading && <p className="wl-status"><IconLoader size={14} /> Verifying...</p>}
            </div>
          )}

          {/* ── STEP: Setup PIN ── */}
          {step === STEPS.SETUP_PIN && (
            <div className="wl-step wl-step--enter">
              <div className="wl-step-header">
                <div className="wl-step-icon wl-step-icon--gold"><IconKey size={24} /></div>
                <h2 className="wl-step-title">{showConfirm ? 'Confirm your PIN' : 'Create a 4-digit PIN'}</h2>
                <p className="wl-step-subtitle">{showConfirm ? 'Enter the same PIN again to confirm.' : 'You\'ll use this to sign in quickly.'}</p>
              </div>

              {/* Step indicator */}
              <div className="wl-step-dots">
                <div className={`wl-dot ${!showConfirm ? 'wl-dot--active' : 'wl-dot--done'}`} />
                <div className={`wl-dot ${showConfirm ? 'wl-dot--active' : ''}`} />
              </div>

              {!showConfirm ? (
                <PinBoxes values={setupPin} refs={setupPinRefs} disabled={loading} />
              ) : (
                <PinBoxes values={confirmPin} refs={confirmPinRefs} disabled={loading} />
              )}
              {error && <p className="wl-error">{error}</p>}
              {loading && <p className="wl-status"><IconLoader size={14} /> Setting up your account...</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ICUNI Connect — Settings Page
 * User profile, currency, notifications, security (PIN), privacy.
 */
import React, { useState, useRef } from 'react';
import { authState, changePin } from '../lib/api';
import { useTheme } from '../lib/theme';
import { IconUser, IconSun, IconMoon, IconBell, IconTrash, IconShield, IconKey, IconLogout, IconCheck, IconLock, IconEye, IconEyeOff, IconPhone, IconAlertCircle, IconLoader } from '../lib/icons';

export default function Settings() {
  const user = authState.getUser();
  const { isDark, toggle } = useTheme();
  const [currency, setCurrency] = useState('GHS');
  const [notifications, setNotifications] = useState({ email: true, requests: true, analytics: false });
  const [showDelete, setShowDelete] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U';

  // PIN state
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmNewPin, setConfirmNewPin] = useState(['', '', '', '']);
  const [pinStep, setPinStep] = useState(user?.hasPin ? 'current' : 'new'); // current | new | confirm
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const currentPinRefs = [useRef(), useRef(), useRef(), useRef()];
  const newPinRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmPinRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePinChange = (index, value, pinArray, setter, refs) => {
    if (!/^\d?$/.test(value)) return;
    const newArr = [...pinArray];
    newArr[index] = value;
    setter(newArr);
    if (value && index < 3) refs[index + 1].current?.focus();
  };

  const handlePinKeyDown = (index, e, pinArray, setter, refs) => {
    if (e.key === 'Backspace' && !pinArray[index] && index > 0) {
      refs[index - 1].current?.focus();
      const newArr = [...pinArray];
      newArr[index - 1] = '';
      setter(newArr);
    }
  };

  const PinInput = ({ values, onChange, onKeyDown, refs, disabled }) => (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {values.map((digit, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => onChange(i, e.target.value, values, onChange === handlePinInputCurrent ? setCurrentPin : onChange === handlePinInputNew ? setNewPin : setConfirmNewPin, refs)}
          onKeyDown={e => onKeyDown(i, e, values, onChange === handlePinInputCurrent ? setCurrentPin : onChange === handlePinInputNew ? setNewPin : setConfirmNewPin, refs)}
          style={{
            width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800,
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`,
            background: 'var(--bg-glass)', color: 'var(--text-primary)',
            outline: 'none', transition: 'border-color 0.2s ease',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
          onBlur={e => { e.target.style.borderColor = digit ? 'var(--accent)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
      ))}
    </div>
  );

  // Handlers that avoid the scope issue
  const handlePinInputCurrent = () => {};
  const handlePinInputNew = () => {};

  const handleSubmitPinChange = async () => {
    const currentPinStr = currentPin.join('');
    const newPinStr = newPin.join('');
    const confirmStr = confirmNewPin.join('');

    if (user?.hasPin && currentPinStr.length !== 4) {
      setPinError('Please enter your current 4-digit PIN.');
      return;
    }
    if (newPinStr.length !== 4) {
      setPinError('Please enter a new 4-digit PIN.');
      return;
    }
    if (newPinStr !== confirmStr) {
      setPinError('New PINs don\'t match.');
      setConfirmNewPin(['', '', '', '']);
      confirmPinRefs[0].current?.focus();
      return;
    }

    setPinLoading(true);
    setPinError('');
    try {
      await changePin(user?.hasPin ? currentPinStr : '', newPinStr);
      setPinSuccess('PIN updated successfully!');
      setShowPinChange(false);
      setCurrentPin(['', '', '', '']);
      setNewPin(['', '', '', '']);
      setConfirmNewPin(['', '', '', '']);
      // Update local user state
      const updatedUser = { ...user, hasPin: true };
      authState.setSession(authState.getToken(), updatedUser);
      setTimeout(() => setPinSuccess(''), 3000);
    } catch (err) {
      setPinError(err.message || 'Failed to update PIN.');
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}><IconUser size={18} /> Profile</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <div className="avatar avatar-xl">{initials}</div>
          <div>
            <h4>{user?.name || 'User'}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.email || 'user@email.com'}</p>
            {user?.phone && <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><IconPhone size={13} /> {user.phone}</p>}
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 4 }}>Role: {user?.role || 'PM'}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Default Currency</label>
          <select className="form-input form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
            {['GHS', 'USD', 'GBP', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Security — PIN Management */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
          <IconLock size={18} /> Security
        </h3>

        {/* PIN Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <p style={{ fontWeight: 600 }}>4-Digit Login PIN</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {user?.hasPin ? 'Your PIN is set and active.' : 'No PIN set yet. Set one for quick sign-in.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
              borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
              background: user?.hasPin ? 'var(--success-dim, rgba(0,200,150,0.1))' : 'var(--gold-dim)',
              color: user?.hasPin ? 'var(--success)' : 'var(--gold)',
            }}>
              {user?.hasPin ? <><IconCheck size={12} /> Active</> : <><IconKey size={12} /> Not Set</>}
            </span>
          </div>
        </div>

        {pinSuccess && (
          <div style={{ padding: 'var(--space-md)', background: 'rgba(0,200,150,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500 }}>
            {pinSuccess}
          </div>
        )}

        {!showPinChange ? (
          <button className="btn btn-secondary btn-full" style={{ justifyContent: 'flex-start' }}
            onClick={() => { setShowPinChange(true); setPinError(''); setPinSuccess(''); setPinStep(user?.hasPin ? 'current' : 'new'); }}>
            <IconKey size={16} /> {user?.hasPin ? 'Change PIN' : 'Set Up PIN'}
          </button>
        ) : (
          <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
              {user?.hasPin && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: pinStep === 'current' ? 'var(--accent)' : 'var(--success)', transition: 'background 0.3s' }} />
              )}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pinStep === 'new' ? 'var(--accent)' : pinStep === 'confirm' ? 'var(--success)' : 'var(--border)', transition: 'background 0.3s' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pinStep === 'confirm' ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
            </div>

            {/* Current PIN */}
            {pinStep === 'current' && (
              <div>
                <p style={{ textAlign: 'center', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Enter current PIN</p>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 'var(--space-lg)' }}>Verify your identity first.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  {currentPin.map((digit, i) => (
                    <input key={i} ref={currentPinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handlePinChange(i, e.target.value, currentPin, setCurrentPin, currentPinRefs)}
                      onKeyDown={e => handlePinKeyDown(i, e, currentPin, setCurrentPin, currentPinRefs)}
                      style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: 'var(--radius-md)', border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button className="btn btn-primary btn-full" onClick={() => { if (currentPin.join('').length === 4) { setPinStep('new'); setTimeout(() => newPinRefs[0].current?.focus(), 100); } else { setPinError('Enter all 4 digits.'); } }}>
                  Next
                </button>
              </div>
            )}

            {/* New PIN */}
            {pinStep === 'new' && (
              <div>
                <p style={{ textAlign: 'center', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Enter new PIN</p>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 'var(--space-lg)' }}>Choose a 4-digit PIN you'll remember.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  {newPin.map((digit, i) => (
                    <input key={i} ref={newPinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handlePinChange(i, e.target.value, newPin, setNewPin, newPinRefs)}
                      onKeyDown={e => handlePinKeyDown(i, e, newPin, setNewPin, newPinRefs)}
                      style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: 'var(--radius-md)', border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button className="btn btn-primary btn-full" onClick={() => { if (newPin.join('').length === 4) { setPinStep('confirm'); setTimeout(() => confirmPinRefs[0].current?.focus(), 100); } else { setPinError('Enter all 4 digits.'); } }}>
                  Next
                </button>
              </div>
            )}

            {/* Confirm new PIN */}
            {pinStep === 'confirm' && (
              <div>
                <p style={{ textAlign: 'center', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Confirm new PIN</p>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 'var(--space-lg)' }}>Re-enter to confirm.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  {confirmNewPin.map((digit, i) => (
                    <input key={i} ref={confirmPinRefs[i]} type="password" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handlePinChange(i, e.target.value, confirmNewPin, setConfirmNewPin, confirmPinRefs)}
                      onKeyDown={e => handlePinKeyDown(i, e, confirmNewPin, setConfirmNewPin, confirmPinRefs)}
                      style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: 'var(--radius-md)', border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button className="btn btn-primary btn-full" onClick={handleSubmitPinChange} disabled={pinLoading}>
                  {pinLoading ? <><IconLoader size={14} /> Saving...</> : user?.hasPin ? 'Update PIN' : 'Set PIN'}
                </button>
              </div>
            )}

            {pinError && <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', textAlign: 'center', marginTop: 'var(--space-md)' }}>{pinError}</p>}

            <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 'var(--space-md)' }}
              onClick={() => { setShowPinChange(false); setPinError(''); setCurrentPin(['', '', '', '']); setNewPin(['', '', '', '']); setConfirmNewPin(['', '', '', '']); setPinStep(user?.hasPin ? 'current' : 'new'); }}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Appearance */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
          {isDark ? <IconMoon size={18} /> : <IconSun size={18} />} Appearance
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600 }}>Dark Mode</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Toggle between dark and light theme</p>
          </div>
          <button className={`toggle ${isDark ? 'active' : ''}`} onClick={toggle}><span className="toggle-knob" /></button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}><IconBell size={18} /> Notifications</h3>
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { key: 'requests', label: 'Request Alerts', desc: 'Get notified when talents respond' },
          { key: 'analytics', label: 'Weekly Analytics', desc: 'Receive weekly profile performance summary' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <button className={`toggle ${notifications[item.key] ? 'active' : ''}`}
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}>
              <span className="toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      {/* Privacy & Danger */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}><IconShield size={18} /> Privacy & Account</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button className="btn btn-danger btn-full" style={{ justifyContent: 'flex-start' }} onClick={() => setShowDelete(true)}>
            <IconTrash size={16} /> Request Account Deletion
          </button>
        </div>
        {showDelete && (
          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)', background: 'var(--danger-dim)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
            <p style={{ fontWeight: 600, color: 'var(--danger)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertCircle size={16} /> Account Deletion</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.7 }}>
              Your account, talent profile, and all associated data will be moved to a deletion queue. You have 30 days to cancel this request before permanent deletion.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger btn-sm"><IconTrash size={14} /> Confirm Deletion Request</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

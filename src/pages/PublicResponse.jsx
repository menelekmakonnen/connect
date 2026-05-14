/**
 * ICUNI Connect — Public Response Page
 * No auth required. Talent responds to deal memo via token link.
 * URL: /r?token=...
 */
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconCheck, IconX, IconAlertCircle, IconRefresh, IconClapperboard, IconPin, IconCalendar, IconUser } from '../lib/icons';

const DEMO_MEMO = {
  project: 'Golden Coast',
  type: 'Film › Feature Film',
  role: 'Director of Photography',
  fee: 'GHS 1,200',
  feeUnit: 'per day',
  currency: 'GHS',
  dates: 'May 12 – Jun 8, 2026',
  location: 'Accra, Ghana',
  message: `Dear Ama,\n\nWe'd love to have you on board as our Director of Photography for "Golden Coast", a feature film exploring the coastal heritage of Ghana.\n\nThe production is scheduled for 4 weeks in Accra with potential travel to Cape Coast. We believe your expertise in atmospheric cinematography would be perfect for this project.\n\nPlease review the details below and let us know your availability.\n\nBest regards,\nKwame Mensah\nICUNI Connect`,
  sender: 'Kwame Mensah',
  otherTalents: ['Kofi Asante', 'Grace Osei', 'Kwame Mensah'],
};

export default function PublicResponse() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [responded, setResponded] = useState(false);
  const [responseAction, setResponseAction] = useState(null);
  const [counterFee, setCounterFee] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [showCounter, setShowCounter] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const memo = DEMO_MEMO;

  const handleRespond = (action) => {
    setResponseAction(action);
    setResponded(true);
  };

  if (responded) {
    return (
      <div className="login-page">
        <div className="login-card animate-spring-pop" style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'center' }}>
            {responseAction === 'accepted' ? <IconCheck size={48} style={{ color: 'var(--success)' }} /> : responseAction === 'declined' ? <IconX size={48} style={{ color: 'var(--danger)' }} /> : <IconAlertCircle size={48} style={{ color: 'var(--accent)' }} />}
          </div>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>
            {responseAction === 'accepted' ? 'Response Submitted!' : responseAction === 'declined' ? 'Decline Recorded' : 'Message Sent'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>
            {responseAction === 'accepted'
              ? `Thank you! ${memo.sender} has been notified. You'll hear back shortly with next steps.`
              : responseAction === 'declined'
              ? `Your decline has been recorded. ${memo.sender} will be notified.`
              : `Your message has been sent to ${memo.sender}. They'll respond via email.`
            }
          </p>
          <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-lg)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>Want to track future requests?</p>
            <button className="btn btn-primary">Create an ICUNI Connect Account</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page" style={{ alignItems: 'flex-start', paddingTop: 'var(--space-2xl)' }}>
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div className="login-card" style={{ marginBottom: 'var(--space-lg)', maxWidth: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h6 style={{ color: 'var(--accent-text)', marginBottom: 'var(--space-sm)' }}>DEAL MEMO REQUEST</h6>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{memo.project}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{memo.type}</p>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Role</p>
              <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{memo.role}</p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Fee</p>
              <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--accent-text)' }}>{memo.fee} <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{memo.feeUnit}</span></p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Dates</p>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{memo.dates}</p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Location</p>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{memo.location}</p>
            </div>
          </div>

          {/* Message */}
          <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {memo.message}
            </p>
          </div>

          {/* Other talents */}
          {memo.otherTalents && memo.otherTalents.length > 0 && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
              Also on this project: {memo.otherTalents.slice(0, 3).join(', ')}{memo.otherTalents.length > 3 ? ` and ${memo.otherTalents.length - 3} others` : ''}
            </p>
          )}

          {/* Response buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <button className="btn btn-primary btn-lg btn-full" onClick={() => handleRespond('accepted')} style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}>
              <IconCheck size={18} /> Accept
            </button>
            <button className="btn btn-danger btn-lg btn-full" onClick={() => handleRespond('declined')}>
              <IconX size={18} /> Decline
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <button className="btn btn-secondary btn-full" onClick={() => { setShowQuestion(!showQuestion); setShowCounter(false); }}>
              <IconAlertCircle size={16} /> Ask a Question
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => { setShowCounter(!showCounter); setShowQuestion(false); }}>
              <IconRefresh size={16} /> Counter Offer
            </button>
          </div>

          {/* Question form */}
          {showQuestion && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <textarea className="form-input" placeholder="Type your question..." rows={3} value={questionText} onChange={e => setQuestionText(e.target.value)} />
              <button className="btn btn-primary" style={{ marginTop: 'var(--space-sm)' }} onClick={() => handleRespond('question')} disabled={!questionText.trim()}>
                Send Question
              </button>
            </div>
          )}

          {/* Counter offer form */}
          {showCounter && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <label className="form-label">Your proposed fee ({memo.currency})</label>
              <input className="form-input" type="number" placeholder="e.g. 1500" value={counterFee} onChange={e => setCounterFee(e.target.value)} />
              <button className="btn btn-gold" style={{ marginTop: 'var(--space-sm)' }} onClick={() => handleRespond('counter')} disabled={!counterFee}>
                Submit Counter Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

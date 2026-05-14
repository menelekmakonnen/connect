/**
 * ICUNI Connect — Requests Page (Deal Memo Coordinator Dashboard)
 * Wired to live API.
 */
import React, { useState, useEffect } from 'react';
import {
  IconSend, IconEye, IconCheck, IconX, IconClock, IconFilter,
  IconDownload, IconRefresh, IconMail, IconChevronRight, IconAlertCircle
} from '../lib/icons';
import { listRequests, getRequest } from '../lib/api';
import SkeletonLoader from '../components/SkeletonLoader';

const statusIcons = {
  sent: IconSend, viewed: IconEye, accepted: IconCheck, declined: IconX,
  question: IconAlertCircle, counter: IconRefresh, draft: IconClock, pending: IconClock,
};
const statusColors = {
  sent: 'var(--info)', viewed: 'var(--gold)', accepted: 'var(--success)',
  declined: 'var(--danger)', question: 'var(--purple)', counter: 'var(--gold)',
  draft: 'var(--text-muted)', pending: 'var(--text-muted)',
};

export default function Requests() {
  const [selectedReq, setSelectedReq] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listRequests({}).then(data => {
      setRequests(Array.isArray(data) ? data : []);
    }).catch(err => {
      console.error('Failed to load requests:', err);
      setRequests([]);
    }).finally(() => setLoading(false));
  }, []);

  const handleSelectRequest = async (req) => {
    setSelectedReq(req);
    setDetailLoading(true);
    try {
      const detail = await getRequest(req.ID || req.id);
      setDetailData(detail);
    } catch (err) {
      console.error('Failed to load request detail:', err);
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  if (selectedReq) {
    return <RequestDetail
      request={selectedReq}
      detail={detailData}
      loading={detailLoading}
      onBack={() => { setSelectedReq(null); setDetailData(null); }}
    />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Requests</h1>
        <p className="page-subtitle">Track deal memo responses and manage invitations.</p>
      </div>

      {loading ? (
        <SkeletonLoader variant="table" />
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><IconSend size={48} style={{ color: 'var(--text-muted)' }} /></div>
          <h3>No requests yet</h3>
          <p>Create a project and build your lineup to send deal memo requests.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {requests.map(req => {
            const id = req.ID || req.id;
            const status = req.STATUS || req.status || 'draft';
            const project = req.SUBJECT || req.subject || req.PROJECT_ID || id;
            const createdAt = req.CREATED_AT || req.createdAt || '';
            const sent = Number(req.TOTAL_RECIPIENTS || req.sent || 0);
            const viewed = Number(req.VIEWED || req.viewed || 0);
            const accepted = Number(req.ACCEPTED || req.accepted || 0);
            const declined = Number(req.DECLINED || req.declined || 0);

            return (
              <div key={id} className="card card-hoverable press-scale" style={{ padding: 'var(--space-lg)' }}
                onClick={() => handleSelectRequest(req)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <h4>{project}</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {createdAt ? `Created ${new Date(createdAt).toLocaleDateString()}` : id}
                    </p>
                  </div>
                  <span className="chip" style={{ background: `${statusColors[status]}15`, color: statusColors[status], textTransform: 'capitalize', fontSize: '0.6875rem' }}>
                    {status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', fontSize: '0.8125rem' }}>
                  {[['Sent', sent, 'var(--info)'], ['Viewed', viewed, 'var(--gold)'], ['Accepted', accepted, 'var(--success)'], ['Declined', declined, 'var(--danger)']].map(([label, count, color]) => (
                    <div key={label}>
                      <span style={{ color: 'var(--text-muted)' }}>{label} </span>
                      <span style={{ fontWeight: 700, color }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RequestDetail({ request, detail, loading, onBack }) {
  const id = request.ID || request.id;
  const project = request.SUBJECT || request.subject || request.PROJECT_ID || id;
  const status = request.STATUS || request.status || 'draft';
  const sent = Number(request.TOTAL_RECIPIENTS || request.sent || 0);
  const viewed = Number(request.VIEWED || request.viewed || 0);
  const accepted = Number(request.ACCEPTED || request.accepted || 0);
  const declined = Number(request.DECLINED || request.declined || 0);
  const questions = Number(request.QUESTIONS || request.questions || 0);
  const counters = Number(request.COUNTERS || request.counters || 0);

  const items = detail?.items || [];

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 'var(--space-md)' }}>
        <IconX size={16} /> Back to Requests
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="page-title">{project}</h1>
          <p className="page-subtitle">Request {id}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-secondary btn-sm"><IconEye size={14} /> Preview</button>
          <button className="btn btn-secondary btn-sm"><IconMail size={14} /> Remind</button>
          <button className="btn btn-secondary btn-sm"><IconDownload size={14} /> Export</button>
          {status !== 'closed' && <button className="btn btn-primary btn-sm"><IconSend size={14} /> Send</button>}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        {[['Sent', sent, 'var(--info)'], ['Viewed', viewed, 'var(--gold)'], ['Accepted', accepted, 'var(--success)'], ['Declined', declined, 'var(--danger)'], ['Questions', questions, 'var(--purple)'], ['Counters', counters, 'var(--gold)']].map(([label, count, color]) => (
          <div key={label} className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{count}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recipient table */}
      {loading ? (
        <SkeletonLoader variant="table" />
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No recipient items found for this request.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Talent</th><th>Role</th><th>Fee Offered</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((r, i) => {
                const itemStatus = r.STATUS || r.status || 'pending';
                const Icon = statusIcons[itemStatus] || IconClock;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.TALENT_NAME || r.talentName}</td>
                    <td><span className="chip chip-role">{r.ROLE_NAME || r.roleName}</span></td>
                    <td>{r.FEE_CURRENCY || ''} {r.OFFER_FEE || r.offerFee || '—'}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: statusColors[itemStatus], fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' }}>
                        <Icon size={14} />{itemStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" style={{ width: 28, height: 28 }}><IconEye size={14} /></button>
                        <button className="btn-icon" style={{ width: 28, height: 28 }}><IconRefresh size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

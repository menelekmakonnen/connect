/**
 * ICUNI Connect — Projects Page + Project Builder
 * List view, creation flow, timeline, lineup, and request generation.
 */
import React, { useState, useEffect } from 'react';
import {
  IconPlus, IconEdit, IconTrash, IconCalendar, IconPin, IconFilter,
  IconChevronRight, IconChevronDown, IconCheck, IconX, IconUsers,
  IconSend, IconClock, IconSearch, IconCheckCircle, IconClapperboard
} from '../lib/icons';
import { listProjects } from '../lib/api';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductionPipeline from '../components/ProductionPipeline';

const PROJECT_TYPES = [
  { value: 'film', label: 'Film', subtypes: ['Feature Film', 'Short Film', 'Pilot', 'Web Series Episode'] },
  { value: 'series', label: 'TV Series', subtypes: ['Series Pilot', 'Season', 'Episode'] },
  { value: 'documentary', label: 'Documentary', subtypes: ['Feature Documentary', 'Short Documentary', 'Docuseries'] },
  { value: 'music_video', label: 'Music Video', subtypes: ['Performance', 'Narrative', 'Concept', 'Lyric Video'] },
  { value: 'commercial', label: 'Commercial', subtypes: ['TV Commercial', 'Digital Ad', 'Brand Film', 'Social Content'] },
  { value: 'photoshoot', label: 'Photo Shoot', subtypes: ['Editorial', 'Campaign', 'Portrait', 'Product'] },
  { value: 'event', label: 'Event', subtypes: ['Live Event', 'Conference', 'Workshop', 'Exhibition'] },
  { value: 'other', label: 'Other', subtypes: ['Other'] },
];

const CURRENCIES = ['GHS', 'USD', 'GBP', 'EUR'];
const STATUSES = { draft: 'Draft', active: 'Active', locked: 'Locked', completed: 'Completed', archived: 'Archived' };
const STATUS_COLORS = { draft: 'var(--text-muted)', active: 'var(--accent)', locked: 'var(--gold)', completed: 'var(--success)', archived: 'var(--tier-unverified)' };

const PHASES = [
  { id: 'development', label: 'Development', color: '#5B8DEF' },
  { id: 'pre_production', label: 'Pre-Production', color: '#9D7AEA' },
  { id: 'production', label: 'Production', color: '#E8A838' },
  { id: 'post_production', label: 'Post-Production', color: '#34D399' },
  { id: 'distribution', label: 'Distribution', color: '#E85D9A' },
];


function ProjectCard({ project, onClick }) {
  return (
    <div className="card card-hoverable press-scale" style={{ padding: 'var(--space-lg)' }} onClick={() => onClick(project)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
        <div>
          <h4>{project.title}</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {PROJECT_TYPES.find(t => t.value === project.type)?.label} › {project.subtype}
          </p>
        </div>
        <span className="chip" style={{ background: `${STATUS_COLORS[project.status]}15`, color: STATUS_COLORS[project.status], fontSize: '0.6875rem' }}>
          {STATUSES[project.status]}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconPin size={13} />{project.location}</span>
        <span>{project.currency} {project.budget.toLocaleString()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <IconUsers size={14} />{project.filled}/{project.roles} roles filled
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated {project.updatedAt}</span>
      </div>
      {/* Fill progress bar */}
      <div style={{ height: 3, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', marginTop: 'var(--space-sm)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${project.roles ? (project.filled / project.roles * 100) : 0}%`, background: 'var(--accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

function ProjectBuilder({ project, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: project?.title || '',
    visibility: 'public', type: project?.type || 'film', subtype: project?.subtype || '',
    genres: '', currency: 'GHS', budget: project?.budget || 0,
    location: project?.location || '', brief: '',
  });

  const selectedType = PROJECT_TYPES.find(t => t.value === form.type);
  const subtypes = selectedType?.subtypes || [];
  const steps = ['Create', 'Lineup', 'Requests'];
  const [startDate, setStartDate] = useState('');
  const [phases, setPhases] = useState(null);

  const displayTitle = form.title || 'Untitled Project';

  return (
    <div className="page">
      {/* Sticky header bar */}
      <div className="pb-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <IconX size={14} /> {project ? 'Back' : 'Cancel'}
        </button>
        <div className="pb-header-center">
          <span className="pb-header-badge">{project ? 'Editing' : 'New'}</span>
          <h1 className="pb-header-title">{displayTitle}</h1>
          <p className="pb-header-meta">
            {selectedType?.label}{form.subtype ? ` › ${form.subtype}` : ''}
            {form.location ? ` • ${form.location}` : ''}
            {form.budget > 0 ? ` • ${form.currency} ${form.budget.toLocaleString()}` : ''}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm">Save Draft</button>
      </div>

      {/* Step tabs */}
      <div className="pb-tabs">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`pb-tab ${step === i ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            {i < step ? <IconCheck size={14} /> : null}{s}
          </button>
        ))}
      </div>

      {/* ═══ Step 0: Create (Details + Pipeline combined) ═══ */}
      {step === 0 && (
        <div className="pb-create-layout">
          {/* Section 1: Project Identity */}
          <div className="card pb-section">
            <div className="pb-section-header">
              <div className="pb-section-icon"><IconEdit size={18} /></div>
              <div>
                <h3 className="pb-section-title">Project Identity</h3>
                <p className="pb-section-desc">Define your project's core details.</p>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="form-label">Project Name</label>
              <input className="form-input pb-title-input" value={form.title}
                placeholder="e.g. The Golden Stool — Season 2"
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            {/* Type — radio pills */}
            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="form-label">Project Type</label>
              <div className="pb-radio-grid">
                {PROJECT_TYPES.map(t => (
                  <label key={t.value}
                    className={`pb-radio-pill ${form.type === t.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, type: t.value, subtype: '' })}>
                    <span className="pb-radio-dot" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Subtype — secondary radio pills (appear based on type) */}
            {subtypes.length > 0 && subtypes[0] !== 'Other' && (
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Format</label>
                <div className="pb-radio-grid pb-radio-grid-sub">
                  {subtypes.map(s => (
                    <label key={s}
                      className={`pb-radio-pill pb-radio-pill-sub ${form.subtype === s ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, subtype: s })}>
                      <span className="pb-radio-dot" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Accra, Ghana" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Budget</label>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <div className="pb-currency-chips">
                    {CURRENCIES.map(c => (
                      <button key={c} type="button"
                        className={`pb-currency-chip ${form.currency === c ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, currency: c })}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <input className="form-input" type="number" min="0" max="10000000"
                    style={{ flex: 1 }}
                    value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brief</label>
              <textarea className="form-input" placeholder="What's this project about? Key themes, goals..."
                rows={3} value={form.brief} onChange={e => setForm({ ...form, brief: e.target.value })} />
            </div>
          </div>

          {/* Section 2: Production Pipeline */}
          <div className="card pb-section">
            <ProductionPipeline
              startDate={startDate}
              onStartDateChange={setStartDate}
              phases={phases}
              onPhasesChange={setPhases}
            />
          </div>

          {/* Action bar */}
          <div className="pb-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>
              Continue to Lineup <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Step 1: Lineup ═══ */}
      {step === 1 && (
        <div className="card pb-section">
          <div className="pb-section-header">
            <div className="pb-section-icon"><IconUsers size={18} /></div>
            <div>
              <h3 className="pb-section-title">Role Slots & Lineup</h3>
              <p className="pb-section-desc">Assign talent to each role on {displayTitle}.</p>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
              <IconPlus size={14} /> Add Role Slot
            </button>
          </div>
          {[
            { role: 'Director of Photography', qty: 1, filled: 1, status: 'filled', talent: 'Ama Darko' },
            { role: 'Sound Engineer', qty: 1, filled: 0, status: 'open' },
            { role: 'Gaffer', qty: 2, filled: 1, status: 'filling', talent: 'Kwame Mensah' },
            { role: 'Makeup Artist', qty: 1, filled: 0, status: 'open' },
          ].map((slot, i) => (
            <RoleSlotCard key={i} slot={slot} />
          ))}
          <div className="pb-actions">
            <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn btn-gold"><IconCheckCircle size={14} /> Lock Lineup</button>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue to Requests <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Step 2: Requests ═══ */}
      {step === 2 && (
        <div className="card pb-section">
          <div className="pb-section-header">
            <div className="pb-section-icon"><IconSend size={18} /></div>
            <div>
              <h3 className="pb-section-title">Deal Memo Requests</h3>
              <p className="pb-section-desc">Send professional deal memos for {displayTitle}.</p>
            </div>
          </div>
          <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', marginBottom: 'var(--space-lg)' }}>
            <div className="grid-stats">
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipients</p><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>2</p></div>
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Fee</p><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>GHS 4,200</p></div>
            </div>
          </div>
          <div className="pb-actions">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-secondary"><IconSearch size={14} /> Preview</button>
            <button className="btn btn-primary"><IconSend size={14} /> Send Deal Memo Requests</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseRow({ phase }) {
  const [enabled, setEnabled] = useState(phase.id === 'production');
  const [start, setStart] = useState(phase.id === 'pre_production' ? 2 : phase.id === 'production' ? 5 : 0);
  const [duration, setDuration] = useState(phase.id === 'production' ? 4 : phase.id === 'pre_production' ? 3 : 2);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border)' }}>
      <button className={`toggle ${enabled ? 'active' : ''}`} onClick={() => setEnabled(!enabled)}>
        <span className="toggle-knob" />
      </button>
      <div style={{ width: 140, flexShrink: 0 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: enabled ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {phase.label}
        </span>
      </div>
      {enabled && (
        <div style={{ flex: 1, display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Start (week)</label>
            <input type="range" min="0" max="20" value={start} onChange={e => setStart(Number(e.target.value))}
              style={{ width: '100%', accentColor: phase.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Duration (weeks)</label>
            <input type="range" min="1" max="12" value={duration} onChange={e => setDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: phase.color }} />
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', width: 80, textAlign: 'right' }}>
            W{start + 1}–W{start + duration}
          </span>
        </div>
      )}
    </div>
  );
}

function RoleSlotCard({ slot }) {
  const statusColors = { open: 'var(--accent)', filling: 'var(--gold)', filled: 'var(--success)' };
  return (
    <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-sm)', background: 'var(--bg-glass)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ fontSize: '0.9375rem' }}>{slot.role}</h4>
            <span className="chip" style={{ background: `${statusColors[slot.status]}15`, color: statusColors[slot.status], fontSize: '0.6875rem', textTransform: 'capitalize' }}>
              {slot.status} ({slot.filled}/{slot.qty})
            </span>
          </div>
          {slot.talent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-sm)' }}>
              <div className="avatar avatar-sm" style={{ width: 24, height: 24, fontSize: '0.625rem' }}>{slot.talent[0]}</div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{slot.talent}</span>
            </div>
          )}
        </div>
        <button className="btn btn-secondary btn-sm"><IconPlus size={12} /> Add Talent</button>
      </div>
    </div>
  );
}

export default function Projects() {
  const [view, setView] = useState('list'); // list | builder
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listProjects({}).then(data => {
      setProjects(Array.isArray(data) ? data : []);
    }).catch(err => {
      console.error('Failed to load projects:', err);
      setProjects([]);
    }).finally(() => setLoading(false));
  }, []);

  if (view === 'builder') {
    return <ProjectBuilder project={selected} onBack={() => { setView('list'); setSelected(null); }} />;
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Assemble your production lineup.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setView('builder'); }}>
          <IconPlus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <SkeletonLoader variant="table" />
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><IconClapperboard size={48} style={{ color: 'var(--text-muted)' }} /></div>
          <h3>No projects yet</h3>
          <p>Create your first project to start assembling your production lineup.</p>
          <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => { setSelected(null); setView('builder'); }}>
            <IconPlus size={16} /> New Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} onClick={(proj) => { setSelected(proj); setView('builder'); }} />
          ))}
        </div>
      )}
    </div>
  );
}

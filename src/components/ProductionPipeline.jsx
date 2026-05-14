/**
 * ICUNI Connect — Production Pipeline (Interactive Gantt Chart)
 * Draggable phase bars, global duration slider (decoupled from phase bars),
 * per-phase toggles, adaptive bar labels.
 */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { IconCalendar } from '../lib/icons';
import AnimIcon from '../lib/AnimatedIcons';

const DEFAULT_PHASES = [
  { id: 'development', label: 'Development', color: '#8b5cf6', startDay: 0, durationDays: 28, enabled: true },
  { id: 'pre_production', label: 'Pre-Production', color: '#5B8DEF', startDay: 14, durationDays: 56, enabled: true },
  { id: 'production', label: 'Production', color: '#E8A838', startDay: 42, durationDays: 28, enabled: true },
  { id: 'post_production', label: 'Post-Production', color: '#34D399', startDay: 70, durationDays: 84, enabled: true },
  { id: 'distribution', label: 'Distribution', color: '#E85D9A', startDay: 154, durationDays: 60, enabled: false },
];

const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ProductionPipeline({ startDate, onStartDateChange, phases: externalPhases, onPhasesChange }) {
  const [phases, setPhases] = useState(externalPhases || DEFAULT_PHASES);
  // Global duration is user-controlled and DECOUPLED from individual phase drags
  const [globalDays, setGlobalDays] = useState(210);
  const timelineRef = useRef(null);

  const totalWeeks = Math.ceil(globalDays / 7);
  const totalMonths = Math.ceil(globalDays / 30);

  // Display mode
  const showDays = globalDays <= 14;
  const showMonths = globalDays > 210;
  const displayCols = showDays ? globalDays : showMonths ? totalMonths * 2 : Math.max(totalWeeks + 2, 12);

  const getDaysPerCol = useCallback(() => {
    if (showDays) return 1;
    if (showMonths) return 15;
    return 7;
  }, [showDays, showMonths]);

  const updatePhases = useCallback((next) => {
    setPhases(next);
    onPhasesChange?.(next);
  }, [onPhasesChange]);

  const updatePhase = useCallback((id, updates) => {
    const next = phases.map(p => p.id === id ? { ...p, ...updates } : p);
    updatePhases(next);
  }, [phases, updatePhases]);

  const togglePhase = useCallback((id) => {
    const next = phases.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p);
    updatePhases(next);
  }, [phases, updatePhases]);

  // Global duration slider — just changes the viewport, NOT the phases
  const handleGlobalSlider = useCallback((e) => {
    setGlobalDays(Number(e.target.value));
  }, []);

  // ── Drag Logic ──────────────────────────────────────
  const dragState = useRef(null);

  const getTimelineWidth = useCallback(() => {
    return timelineRef.current?.getBoundingClientRect().width || 600;
  }, []);

  const pxToDays = useCallback((px) => {
    const tlWidth = getTimelineWidth();
    return Math.round((px / tlWidth) * displayCols * getDaysPerCol());
  }, [getTimelineWidth, displayCols, getDaysPerCol]);

  const handleDragStart = useCallback((e, phaseId, dragType) => {
    e.preventDefault();
    const phase = phases.find(p => p.id === phaseId);
    if (!phase || !phase.enabled) return;

    dragState.current = {
      phaseId, dragType,
      startX: e.clientX,
      origStartDay: phase.startDay,
      origDuration: phase.durationDays,
    };

    const handleMove = (ev) => {
      if (!dragState.current) return;
      const dx = ev.clientX - dragState.current.startX;
      const daysDelta = pxToDays(dx);
      const { phaseId: pid, dragType: dt, origStartDay, origDuration } = dragState.current;

      if (dt === 'move') {
        updatePhase(pid, { startDay: Math.max(0, origStartDay + daysDelta) });
      } else if (dt === 'resize-left') {
        const newStart = Math.max(0, origStartDay + daysDelta);
        const newDuration = Math.max(7, origDuration - daysDelta);
        updatePhase(pid, { startDay: newStart, durationDays: newDuration });
      } else if (dt === 'resize-right') {
        updatePhase(pid, { durationDays: Math.max(7, origDuration + daysDelta) });
      }
    };

    const handleUp = () => {
      dragState.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [phases, pxToDays, updatePhase]);

  // Format helpers
  const formatDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getEndDate = () => {
    if (!startDate) return 'Pending Start';
    const end = new Date(startDate);
    end.setDate(end.getDate() + globalDays);
    return formatDate(end);
  };

  // Time headers with actual dates
  const timeHeaders = useMemo(() => {
    const baseDate = startDate ? new Date(startDate) : null;

    if (showDays) {
      return Array.from({ length: globalDays }, (_, i) => {
        if (baseDate) {
          const d = new Date(baseDate); d.setDate(d.getDate() + i);
          return { label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)}`, sub: false };
        }
        return { label: DAY_NAMES[i % 7], sub: false };
      });
    }
    if (showMonths) {
      const headers = [];
      for (let m = 0; m < totalMonths; m++) {
        if (baseDate) {
          const d = new Date(baseDate); d.setMonth(d.getMonth() + m);
          headers.push({ label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear() % 100}`, sub: false });
        } else {
          headers.push({ label: MONTH_NAMES[m % 12], sub: false });
        }
        headers.push({ label: '', sub: true });
      }
      return headers;
    }
    return Array.from({ length: displayCols }, (_, i) => {
      if (baseDate) {
        const d = new Date(baseDate); d.setDate(d.getDate() + i * 7);
        return { label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)}`, sub: false };
      }
      return { label: `W${i + 1}`, sub: false };
    });
  }, [showDays, showMonths, globalDays, totalMonths, displayCols, startDate]);

  // Adaptive bar label
  const formatBarLabel = (days) => {
    if (days <= 14) return `${days}d`;
    if (days <= 60) {
      const w = Math.floor(days / 7);
      const d = days % 7;
      return d > 0 ? `${w}w ${d}d` : `${w}w`;
    }
    const m = Math.round(days / 30 * 10) / 10;
    return `${m}mo`;
  };

  const SLIDER_MAX = 730;
  const sliderPct = ((globalDays - 14) / (SLIDER_MAX - 14)) * 100;

  // Compute the actual span of enabled phases for the delivery badge
  const enabledPhases = phases.filter(p => p.enabled);
  const actualSpan = enabledPhases.length > 0
    ? Math.max(...enabledPhases.map(p => p.startDay + p.durationDays))
    : 0;

  return (
    <div className="pipeline-container">
      {/* Header */}
      <div className="pipeline-header-section">
        <AnimIcon icon="timeline" size={28} />
        <h2 className="pipeline-title">Production Pipeline</h2>
      </div>

      {/* Date Controls */}
      <div className="pipeline-date-row">
        <div className="pipeline-date-card">
          <span className="pipeline-date-label">Target Start Date</span>
          <div className="pipeline-date-input-wrap">
            <IconCalendar size={16} />
            <input type="date" className="pipeline-date-input"
              value={startDate || ''} onChange={e => onStartDateChange?.(e.target.value)} />
          </div>
        </div>
        <div className="pipeline-date-card">
          <span className="pipeline-date-label">Wrapped & Delivered</span>
          <div className="pipeline-delivery-info">
            <span className="pipeline-delivery-text">{getEndDate()}</span>
            <span className="pipeline-duration-chip">{totalWeeks} Weeks</span>
          </div>
        </div>
      </div>

      {/* Gantt Card */}
      <div className="pipeline-gantt-card">
        <div className="pipeline-gantt-header">
          <div>
            <h3 className="pipeline-gantt-title">Production Pipeline</h3>
            <p className="pipeline-gantt-subtitle">
              Drag bars to move. Drag edges to resize. Toggle phases on/off.
            </p>
          </div>
          <div className="pipeline-duration-badge">
            <span className="pipeline-duration-badge-label">Project Window</span>
            <span className="pipeline-duration-badge-value">
              {globalDays} Days ({totalWeeks} Weeks{totalMonths > 2 ? ` / ${totalMonths} Mo` : ''})
            </span>
            <div className="pipeline-slider">
              <div className="pipeline-slider-track">
                <div className="pipeline-slider-fill" style={{ width: `${sliderPct}%` }} />
                <div className="pipeline-slider-ticks">
                  {[30, 90, 180, 365].map(d => (
                    <div key={d} className="pipeline-slider-tick"
                      style={{ left: `${((d - 14) / (SLIDER_MAX - 14)) * 100}%` }} title={`${d} days`} />
                  ))}
                </div>
              </div>
              <input type="range" className="pipeline-slider-input"
                min={14} max={SLIDER_MAX} step={7} value={globalDays}
                onChange={handleGlobalSlider} />
              <div className="pipeline-slider-labels">
                <span>2w</span><span>1m</span><span>3m</span><span>6m</span><span>1y</span><span>2y</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time headers */}
        <div className="pipeline-gantt-grid">
          <div className="pipeline-gantt-labels-col" />
          <div className="pipeline-gantt-timeline-col" ref={timelineRef}>
            <div className="pipeline-week-headers">
              {timeHeaders.map((h, i) => (
                <div key={i} className={`pipeline-week-header ${h.sub ? 'pipeline-week-header-sub' : ''}`}>{h.label}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase Rows */}
        {phases.map(phase => {
          const totalColDays = displayCols * getDaysPerCol();
          const leftPct = (phase.startDay / totalColDays) * 100;
          const widthPct = (phase.durationDays / totalColDays) * 100;

          return (
            <div key={phase.id} className={`pipeline-gantt-grid pipeline-gantt-row ${!phase.enabled ? 'pipeline-row-disabled' : ''}`}>
              <div className="pipeline-gantt-labels-col">
                {/* Toggle switch */}
                <button className={`pipeline-phase-toggle ${phase.enabled ? 'on' : ''}`}
                  onClick={() => togglePhase(phase.id)}
                  style={{ '--phase-color': phase.color }}>
                  <span className="pipeline-toggle-thumb" />
                </button>
                <span className="pipeline-phase-label" style={{ color: phase.enabled ? phase.color : 'var(--text-muted)' }}>
                  {phase.label.toUpperCase()}
                </span>
              </div>
              <div className="pipeline-gantt-timeline-col">
                {/* Grid lines */}
                <div className="pipeline-grid-lines">
                  {timeHeaders.map((_, i) => (
                    <div key={i} className="pipeline-grid-line" />
                  ))}
                </div>
                {/* Bar (only if enabled) */}
                {phase.enabled && (
                  <div
                    className="pipeline-phase-bar"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      background: `linear-gradient(90deg, ${phase.color}cc, ${phase.color})`,
                      boxShadow: `0 2px 12px ${phase.color}40`,
                    }}
                    onMouseDown={(e) => handleDragStart(e, phase.id, 'move')}
                  >
                    <div className="pipeline-bar-handle pipeline-bar-handle-left"
                      onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e, phase.id, 'resize-left'); }} />
                    <span className="pipeline-phase-bar-accent" style={{ background: phase.color }} />
                    <span className="pipeline-phase-bar-label">{formatBarLabel(phase.durationDays)}</span>
                    <div className="pipeline-bar-handle pipeline-bar-handle-right"
                      onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e, phase.id, 'resize-right'); }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Active phases summary */}
        <div className="pipeline-summary">
          <span>{enabledPhases.length} of {phases.length} phases active</span>
          <span>Actual span: {formatBarLabel(actualSpan)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ICUNI Connect — Toast Notification System
 * Short feedback: "Added to Lineup", "Request sent", "Copied link"
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { IconCheckCircle, IconAlertCircle, IconX } from '../lib/icons';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timers.current[id];
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) { clearTimeout(timers.current[id]); delete timers.current[id]; }
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  const iconMap = { success: IconCheckCircle, error: IconAlertCircle, info: IconAlertCircle, warning: IconAlertCircle };
  const colorMap = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--info)', warning: 'var(--warning)' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => {
          const Icon = iconMap[t.type];
          return (
            <div key={t.id} className={`toast toast-${t.type} animate-slide-right`}>
              <Icon size={18} style={{ color: colorMap[t.type], flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button className="btn-icon" style={{ width: 24, height: 24, border: 'none', background: 'none' }} onClick={() => removeToast(t.id)}>
                <IconX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

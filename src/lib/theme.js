/**
 * ICUNI Connect — Theme Provider
 * External store pattern via useSyncExternalStore.
 * Adapted from PrintShop theme.js — zero-flicker, persisted.
 */

const STORAGE_KEY = 'icuni_connect_theme';
const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

let currentTheme = null;
const listeners = new Set();

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  // Default to dark (film-native aesthetic)
  return 'dark';
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  listeners.forEach(fn => fn());
}

// Initialize immediately (before React hydrates) to prevent flicker
if (typeof window !== 'undefined') {
  const initial = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initial);
  currentTheme = initial;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTheme || getInitialTheme();
}

export function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

export function setTheme(theme) {
  if (theme === 'light' || theme === 'dark') applyTheme(theme);
}

// React hook
import { useSyncExternalStore } from 'react';

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  return {
    theme,
    isDark: theme === 'dark',
    toggle: toggleTheme,
    setTheme,
  };
}

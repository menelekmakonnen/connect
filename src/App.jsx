/**
 * ICUNI Connect — App Shell
 * React Router with all routes, protected and public.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authState, initApi } from './lib/api';
import { ToastProvider } from './components/Toast';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Talents from './pages/Talents';
import TalentProfile from './pages/TalentProfile';
import Projects from './pages/Projects';
import Requests from './pages/Requests';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import PublicResponse from './pages/PublicResponse';

// Init cache + prefetch on boot
initApi();

function ProtectedRoute({ children }) {
  if (!authState.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/r" element={<PublicResponse />} />

          {/* Protected App routes */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="talents" element={<Talents />} />
            <Route path="talent/:id" element={<TalentProfile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="requests" element={<Requests />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

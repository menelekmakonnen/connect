/**
 * ICUNI Connect — App Layout
 * Collapsible sidebar + glassmorphic topbar + content area.
 */
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS, NAV_FOOTER, NavIconWrap } from '../lib/NavIcons';
import { IconChevronLeft, IconBell, IconSun, IconMoon, IconSearch } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { authState } from '../lib/api';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = authState.getUser();

  const handleLogout = () => {
    authState.logout();
    navigate('/login');
  };

  const pageTitle = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.label
    || NAV_FOOTER.find(n => n.path && location.pathname.startsWith(n.path))?.label
    || 'ICUNI Connect';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <IconChevronLeft size={16} />
        </button>

        <div className="sidebar-brand">
          <div className="sidebar-logo">{collapsed ? 'IC' : 'ICUNI Connect'}</div>
          {!collapsed && <div className="sidebar-subtitle">Talent Directory</div>}
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-label">Main</div>}
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink key={item.key} to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-link-icon">
                  <NavIconWrap colorKey={item.key} active={isActive} collapsed={collapsed}>
                    <Icon size={18} active={isActive} />
                  </NavIconWrap>
                </span>
                <span className="nav-link-text">{item.label}</span>
              </NavLink>
            );
          })}

          <div className="nav-section-divider" />
          {!collapsed && <div className="nav-section-label">Account</div>}

          {NAV_FOOTER.map(item => {
            if (item.key === 'logout') {
              return (
                <button key="logout" className="nav-link" onClick={handleLogout}>
                  <span className="nav-link-icon">
                    <NavIconWrap colorKey="logout" collapsed={collapsed}>
                      <item.icon size={18} />
                    </NavIconWrap>
                  </span>
                  <span className="nav-link-text">Logout</span>
                </button>
              );
            }
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink key={item.key} to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-link-icon">
                  <NavIconWrap colorKey={item.key} active={isActive} collapsed={collapsed}>
                    <item.icon size={18} active={isActive} />
                  </NavIconWrap>
                </span>
                <span className="nav-link-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar avatar-sm">{user?.name?.[0] || 'U'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">{user?.role || 'Member'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="topbar">
          <h1 className="topbar-title">{pageTitle}</h1>
          <div className="topbar-actions">
            <div className="search-bar" style={{ maxWidth: 320 }}>
              <span className="search-bar-icon"><IconSearch size={16} /></span>
              <input placeholder="Search talents, projects..." />
            </div>
            <button className="btn-icon" aria-label="Notifications"><IconBell size={18} /></button>
            <button className="btn-icon" onClick={toggle} aria-label="Toggle theme">
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Shield, LayoutDashboard, AlertTriangle,
  Activity, FileText, Settings, Zap
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'threats', label: 'Ameaças', icon: AlertTriangle },
  { id: 'activity', label: 'Atividade', icon: Activity },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={20} />
        </div>
        <span className="logo-text">SecureDash</span>
        <div className="logo-badge">
          <Zap size={10} />
          <span>LIVE</span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="sidebar-status">
        <div className="status-dot" />
        <span>Sistema Operacional</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="nav-label">NAVEGAÇÃO</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? 'active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === 'threats' && (
              <span className="nav-badge">3</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-label">Última atualização</p>
          <p className="footer-value">Agora mesmo</p>
        </div>
        <div className="footer-dot" />
      </div>
    </aside>
  );
}

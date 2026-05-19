import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  ShieldAlert, ShieldCheck, Wifi, Clock,
  TrendingUp, AlertCircle, Eye, Lock
} from 'lucide-react';
import './Dashboard.css';

// --- Mock Data ---
const trafficData = [
  { time: '00h', requests: 412, blocked: 38 },
  { time: '03h', requests: 280, blocked: 12 },
  { time: '06h', requests: 390, blocked: 55 },
  { time: '09h', requests: 820, blocked: 90 },
  { time: '12h', requests: 1100, blocked: 140 },
  { time: '15h', requests: 970, blocked: 110 },
  { time: '18h', requests: 1240, blocked: 185 },
  { time: '21h', requests: 890, blocked: 95 },
  { time: '23h', requests: 640, blocked: 70 },
];

const attackData = [
  { type: 'SQLi', count: 84 },
  { type: 'XSS', count: 62 },
  { type: 'DDoS', count: 48 },
  { type: 'CSRF', count: 29 },
  { type: 'RCE', count: 17 },
];

const recentAlerts = [
  { id: 1, severity: 'critical', message: 'SQL Injection detectado em /api/users', ip: '185.220.101.42', time: '2 min atrás' },
  { id: 2, severity: 'high', message: 'Força bruta bloqueada — 200 tentativas', ip: '45.83.64.1', time: '8 min atrás' },
  { id: 3, severity: 'medium', message: 'Varredura de portas detectada', ip: '91.240.118.77', time: '15 min atrás' },
  { id: 4, severity: 'low', message: 'Header X-Frame-Options ausente', ip: 'interno', time: '32 min atrás' },
  { id: 5, severity: 'high', message: 'XSS refletido em parâmetro de busca', ip: '77.111.245.3', time: '41 min atrás' },
];

const services = [
  { name: 'Firewall WAF', status: 'online', uptime: '99.98%' },
  { name: 'IDS/IPS', status: 'online', uptime: '99.91%' },
  { name: 'VPN Gateway', status: 'online', uptime: '100%' },
  { name: 'Auth Service', status: 'degraded', uptime: '98.2%' },
  { name: 'Log Collector', status: 'online', uptime: '99.99%' },
];

// --- Sub Components ---
function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="stat-card" style={{ '--accent': color }}>
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
      {trend && (
        <div className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
          <TrendingUp size={12} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}

function SeverityDot({ severity }) {
  const colors = {
    critical: 'var(--accent-red)',
    high: '#ff7043',
    medium: 'var(--accent-yellow)',
    low: 'var(--accent-green)',
  };
  return (
    <span className="severity-dot" style={{ background: colors[severity], boxShadow: `0 0 6px ${colors[severity]}` }} />
  );
}

// --- Dashboard Page ---
export default function Dashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString('pt-BR');
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Centro de Segurança</h1>
          <p className="dash-subtitle capitalize">{dateStr}</p>
        </div>
        <div className="dash-clock">
          <Clock size={14} />
          <span>{timeStr}</span>
        </div>
      </header>

      {/* Stat Cards */}
      <section className="stats-grid">
        <StatCard icon={ShieldAlert} label="Ameaças Hoje" value="347" sub="+23 na última hora" color="var(--accent-red)" trend={12} />
        <StatCard icon={ShieldCheck} label="Bloqueadas" value="339" sub="97.7% de eficiência" color="var(--accent-green)" trend={5} />
        <StatCard icon={Wifi} label="Requisições" value="8.241" sub="nas últimas 24h" color="var(--accent-cyan)" trend={-3} />
        <StatCard icon={Eye} label="IPs Monitorados" value="1.482" sub="12 suspeitos" color="var(--accent-yellow)" />
        <StatCard icon={Lock} label="Autenticações" value="2.910" sub="18 falhas bloqueadas" color="var(--accent-purple)" />
        <StatCard icon={AlertCircle} label="Alertas Ativos" value="3" sub="1 crítico" color="var(--accent-red)" />
      </section>

      {/* Charts Row */}
      <section className="charts-row">
        {/* Traffic Chart */}
        <div className="chart-card wide">
          <div className="card-header">
            <h2 className="card-title">Tráfego vs Bloqueios</h2>
            <span className="card-tag">Últimas 24h</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#3d5a7a', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3d5a7a', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1f3c', border: '1px solid #1a3050', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }}
                labelStyle={{ color: '#7a9cc0' }}
              />
              <Area type="monotone" dataKey="requests" stroke="#00e5ff" strokeWidth={2} fill="url(#gRequests)" name="Requisições" />
              <Area type="monotone" dataKey="blocked" stroke="#ff3b5c" strokeWidth={2} fill="url(#gBlocked)" name="Bloqueadas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Types */}
        <div className="chart-card">
          <div className="card-header">
            <h2 className="card-title">Tipos de Ataque</h2>
            <span className="card-tag">Hoje</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attackData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
              <XAxis type="number" tick={{ fill: '#3d5a7a', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fill: '#7a9cc0', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: '#0d1f3c', border: '1px solid #1a3050', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="count" fill="#7c4dff" radius={[0, 4, 4, 0]} name="Ataques" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="bottom-row">
        {/* Alerts */}
        <div className="chart-card wide">
          <div className="card-header">
            <h2 className="card-title">Alertas Recentes</h2>
            <span className="card-tag live">● AO VIVO</span>
          </div>
          <div className="alerts-list">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`alert-row severity-${alert.severity}`}>
                <SeverityDot severity={alert.severity} />
                <div className="alert-info">
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-meta">
                    <span>{alert.ip}</span>
                    <span>·</span>
                    <span>{alert.time}</span>
                  </p>
                </div>
                <span className={`alert-badge ${alert.severity}`}>{alert.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="chart-card">
          <div className="card-header">
            <h2 className="card-title">Status dos Serviços</h2>
          </div>
          <div className="services-list">
            {services.map(svc => (
              <div key={svc.name} className="service-row">
                <div className={`service-indicator ${svc.status}`} />
                <span className="service-name">{svc.name}</span>
                <span className={`service-status ${svc.status}`}>{svc.status === 'online' ? 'Online' : 'Degradado'}</span>
                <span className="service-uptime">{svc.uptime}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import './VPODashboard.css';

const nivelCor = { '0': '#1a1a1a', '1': '#c62828', '2': '#e65100', '3': '#1565c0', '4': '#6a1b9a' };
const getNivelCor = (n) => { const c = nivelCor[String(n)]; return c !== undefined ? c : '#aaa'; };
const statusCor = { 'Concluído': '#2e7d32', 'Pendente': '#f9a825', 'Em andamento': '#1565c0', 'Cancelado': '#c62828' };

export default function VPODashboard() {
  const { data } = useData();
  const { territorioSeguro, alertasSeguranca, ordensSeg, regrasSalvamVidas,
          precursoresSIF, ivsPreventivos, championForno, gestaoTS, estilo: e } = data;

  return (
    <div className="vpo-root" style={{ background: e.corFundo, fontFamily: e.fonteTitulos + ', sans-serif' }}>

      {/* Cabeçalho */}
      <header className="vpo-header">
        <div className="vpo-header-section" style={{ background: e.corHeader }}>SEGURANÇA</div>
        <div className="vpo-header-section" style={{ background: e.corHeaderGente }}>GENTE</div>
      </header>

      <div className="vpo-grid">

        {/* ── COL 1 ── */}
        <div className="vpo-col">

          {/* Gestão de TS */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Gestão de TS</div>
            <div className="gestao-ts-body">
              {gestaoTS?.texto && <p className="gestao-texto">{gestaoTS.texto}</p>}
              {gestaoTS?.links?.length > 0 && (
                <ul className="gestao-links">
                  {gestaoTS.links.map(l => (
                    <li key={l.id}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">🔗 {l.titulo}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Champion Forno */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelOrange, color: '#fff' }}>Champion Forno</div>
            <div className="champion-body">
              {championForno?.map(c => (
                <div key={c.id} className="champion-row">
                  <div className="champion-avatar">{c.nome.charAt(0)}</div>
                  <div className="champion-info">
                    <p className="champion-nome">{c.nome}</p>
                    <p className="champion-sub">{c.funcao} · Turno {c.turno}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regras que Salvam Vidas */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Regras que Salvam Vidas</div>
            <ul className="regras-list">
              {regrasSalvamVidas?.map((r, i) => (
                <li key={i} style={{ fontSize: e.tamanhoRegras + 'rem' }}>
                  <span style={{ color: e.corRegrasBullet }}>•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── COL 2 ── */}
        <div className="vpo-col">

          {/* SIF Precursores */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>SIF Precursores</div>
            <div className="precursores-body">
              <ul className="precursores-lista">
                {precursoresSIF?.itens?.map(item => (
                  <li key={item.id}>• {item.nome}</li>
                ))}
              </ul>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={precursoresSIF?.valores} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, fontFamily: 'Syne' }} />
                  <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                    {precursoresSIF?.valores?.map((entry, i) => (
                      <Cell key={i} fill={entry.valor > 6 ? '#e53935' : '#1565c0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* IVs Preventivos */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>IVs Preventivos</div>
            <div className="precursores-body">
              <ul className="precursores-lista">
                {ivsPreventivos?.itens?.map(item => (
                  <li key={item.id}>• {item.nome}</li>
                ))}
              </ul>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={ivsPreventivos?.valores} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, fontFamily: 'Syne' }} />
                  <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                    {ivsPreventivos?.valores?.map((entry, i) => (
                      <Cell key={i} fill={entry.valor > 6 ? '#e53935' : '#2e7d32'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas de Segurança */}
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Alertas de Segurança</div>
            <div className="alertas-body">
              {alertasSeguranca?.map(a => (
                <div key={a.id} className="alerta-row">
                  <div className="alerta-header">
                    <span className="alerta-unidade">{a.unidade}</span>
                    <span className="alerta-data">{a.data}</span>
                  </div>
                  <p className="alerta-ocorrencia">{a.ocorrencia}</p>
                  <p className="alerta-acao">↳ {a.acaoAplicavel}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── COL 3 — Gente ── */}
        <div className="vpo-col">

          {/* Território Seguro */}
          <div className="vpo-card ts-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGreen, color: '#fff' }}>Território Seguro</div>
            <div className="ts-body">
              {territorioSeguro?.map(ts => (
                <div key={ts.id} className="ts-row">
                  <div className="ts-nivel-badge" style={{ background: getNivelCor(ts.nivel) }}>
                    {ts.nivel}
                  </div>
                  <div className="ts-info">
                    <p className="ts-nome">{ts.nome}</p>
                    <p className="ts-acao">{ts.acaoFoco}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordens de Segurança — ocupa 2 espaços */}
          <div className="vpo-card ordens-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>Ordens de Segurança</div>
            <div className="ordens-body">
              <div className="ordens-thead">
                <span>Data</span>
                <span>Ordem</span>
                <span className="ordens-texto-col">Texto</span>
                <span>Status</span>
              </div>
              {ordensSeg?.map(o => (
                <div key={o.id} className="ordens-row">
                  <span className="ordens-data">{o.data}</span>
                  <span className="ordens-ordem">{o.ordem}</span>
                  <span className="ordens-texto">{o.texto}</span>
                  <span className="ordens-status" style={{ color: statusCor[o.status] || '#555' }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

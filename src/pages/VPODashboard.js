import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import './VPODashboard.css';

const nivelCor = { '0': '#1a1a1a', '1': '#c62828', '2': '#e65100', '3': '#1565c0', '4': '#6a1b9a' };
const getNivelCor = (n) => { const c = nivelCor[String(n)]; return c !== undefined ? c : '#aaa'; };
const statusCor = { 'Concluído': '#2e7d32', 'Pendente': '#f9a825', 'Em andamento': '#1565c0', 'Cancelado': '#c62828' };

function exportarExcel(ordensSeg) {
  const header = ['Data', 'Ordem', 'Texto', 'Status'];
  const rows = ordensSeg.map(o => [o.data, o.ordem, o.texto, o.status]);
  const csvContent = [header, ...rows]
    .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ordens_seguranca.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function VPODashboard() {
  const { data } = useData();
  const { territorioSeguro, alertasSeguranca, ordensSeg, regrasSalvamVidas,
          precursoresSIF, ivsPreventivos, championForno, gestaoTS, estilo: e } = data;

  const shareWhatsApp = () => {
    const msg = encodeURIComponent('Confira o Quadro VPO: ' + window.location.href);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="vpo-root" style={{ background: e.corFundo, fontFamily: e.fonteTitulos + ', sans-serif' }}>

      {/* Cabeçalho */}
      <header className="vpo-header">
        <div className="vpo-header-section" style={{ background: e.corHeader }}>SEGURANÇA</div>
        <div className="vpo-header-section" style={{ background: e.corHeaderGente }}>{e.tituloGente || 'GENTE'}</div>
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
            <div className="vpo-card-label" style={{ background: e.corLabelOrange, color: '#fff' }}>
              {e.tituloChampion || 'Champion Forno'}
            </div>
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

          {/* Alertas de Segurança — com scroll */}
          <div className="vpo-card alertas-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Alertas de Segurança</div>
            <div className="alertas-body scroll-box">
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

          {/* Ordens de Segurança — com scroll + export */}
          <div className="vpo-card ordens-card">
            <div className="ordens-card-header">
              <div className="vpo-card-label ordens-label" style={{ background: e.corLabelGray, color: '#fff' }}>
                Ordens de Segurança
              </div>
              <button className="btn-excel" onClick={() => exportarExcel(ordensSeg || [])} title="Exportar para Excel">
                📥 Excel
              </button>
            </div>
            <div className="ordens-thead">
              <span>Data</span>
              <span>Ordem</span>
              <span>Texto</span>
              <span>Status</span>
            </div>
            <div className="ordens-body scroll-box">
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

      {/* Botão WhatsApp */}
      <button className="btn-whatsapp" onClick={shareWhatsApp} title="Compartilhar no WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

    </div>
  );
}

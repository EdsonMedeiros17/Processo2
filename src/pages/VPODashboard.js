import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import './VPODashboard.css';

function ImageCard({ src, label }) {
  return (
    <div className="img-card">
      {src ? (
        <img src={src} alt={label} />
      ) : (
        <div className="img-placeholder">
          <span className="img-icon">📄</span>
          <p>{label}</p>
        </div>
      )}
    </div>
  );
}

export default function VPODashboard() {
  const { data } = useData();
  const { engagement, bancoHoras, ordensSeg, regrasSalvamVidas, precursoresSIF, imagens, estilo } = data;
  const e = estilo;

  return (
    <div className="vpo-root" style={{ background: e.corFundo, fontFamily: e.fonteTitulos + ', sans-serif' }}>

      {/* Cabeçalho */}
      <header className="vpo-header">
        <div className="vpo-header-section seg" style={{ background: e.corHeader }}>
          SEGURANÇA
        </div>
        <div className="vpo-header-section gente" style={{ background: e.corHeaderGente }}>
          GENTE
        </div>
      </header>

      {/* Grade */}
      <div className="vpo-grid">

        {/* COL 1 */}
        <div className="vpo-col">
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Inventário de SIFs</div>
            <ImageCard src={imagens.inventarioSIF} label="Inventário de SIFs" />
          </div>

          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelOrange, color: '#fff' }}>Champion Forno</div>
            <ImageCard src={imagens.championForno} label="Equipe Champion Forno" />
          </div>

          <div className="vpo-card regras-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Regras que Salvam Vidas</div>
            <ul className="regras-list">
              {regrasSalvamVidas.map((r, i) => (
                <li key={i} style={{ fontSize: e.tamanhoRegras + 'rem' }}>
                  <span className="regra-bullet" style={{ color: e.corRegrasBullet }}>•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COL 2 */}
        <div className="vpo-col">
          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>SIF</div>
            <ImageCard src={imagens.sifFluxo} label="Fluxo SIF" />
          </div>

          <div className="vpo-card precursores-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>Precursores de SIF</div>
            <div className="precursores-body">
              <div className="precursores-itens">
                {precursoresSIF.itens.map((item, i) => (
                  <p key={i} className="precursor-item">• {item}</p>
                ))}
              </div>
              <p className="ivs-titulo">IVs Preventivos</p>
              {precursoresSIF.ivs.map((iv, i) => (
                <p key={i} className="iv-item">• {iv}</p>
              ))}
              <div className="precursores-chart">
                <ResponsiveContainer width="100%" height={90}>
                  <BarChart data={precursoresSIF.valores} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                    <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                      {precursoresSIF.valores.map((entry, index) => (
                        <Cell key={index} fill={entry.valor > 6 ? '#e53935' : '#1565c0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="vpo-card">
            <div className="vpo-card-label" style={{ background: e.corLabelYellow, color: '#1a1a00' }}>Alertas de Segurança</div>
            <ImageCard src={imagens.alertaSeguranca} label="Alerta de Segurança" />
          </div>
        </div>

        {/* COL 3 — Gente */}
        <div className="vpo-col">
          <div className="vpo-card engagement-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGreen, color: '#fff' }}>Engagement</div>
            <div className="engagement-body">
              <p className="eng-label">Processo</p>
              <p className="eng-value" style={{ fontSize: e.tamanhoEngagement + 'rem', color: e.corEngagementValor }}>
                {engagement.processo}%
              </p>
              <p className="eng-label">Eficiência do Gestor</p>
              <p className="eng-value" style={{ fontSize: e.tamanhoEngagement + 'rem', color: e.corEngagementValor }}>
                {engagement.eficienciaGestor}%
              </p>
              {engagement.assinatura && (
                <p className="eng-assinatura">{engagement.assinatura}</p>
              )}
            </div>
          </div>

          <div className="vpo-card lista-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>Banco de Horas</div>
            <ul className="lista-nomes">
              {bancoHoras.map((item) => (
                <li key={item.id} style={{ fontSize: e.tamanhoListas + 'rem' }}>
                  <span className="lista-data">{item.data}</span>
                  <span className="lista-nome">{item.nome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="vpo-card lista-card">
            <div className="vpo-card-label" style={{ background: e.corLabelGray, color: '#fff' }}>Ordens SEG</div>
            <ul className="lista-nomes">
              {ordensSeg.map((item) => (
                <li key={item.id} style={{ fontSize: e.tamanhoListas + 'rem' }}>
                  <span className="lista-data">{item.data}</span>
                  <span className="lista-nome">{item.nome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

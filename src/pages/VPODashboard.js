import React from 'react';
import { useData } from '../context/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell
} from 'recharts';
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
  const { engagement, bancoHoras, ordensSeg, regrasSalvamVidas, precursoresSIF, imagens } = data;

  return (
    <div className="vpo-root">
      {/* Cabeçalho */}
      <header className="vpo-header">
        <div className="vpo-header-section seg">
          <span>SEGURANÇA</span>
        </div>
        <div className="vpo-header-section gente">
          <span>GENTE</span>
        </div>
      </header>

      {/* Grade principal */}
      <div className="vpo-grid">

        {/* COL 1 — Segurança esquerda */}
        <div className="vpo-col col-seg-left">

          {/* Inventário de SIFs */}
          <div className="vpo-card">
            <div className="vpo-card-label yellow">Inventário de SIFs</div>
            <ImageCard src={imagens.inventarioSIF} label="Inventário de SIFs" />
          </div>

          {/* Champion Forno */}
          <div className="vpo-card">
            <div className="vpo-card-label orange">Champion Forno</div>
            <ImageCard src={imagens.championForno} label="Equipe Champion Forno" />
          </div>

          {/* Regras que Salvam Vidas */}
          <div className="vpo-card regras-card">
            <div className="vpo-card-label yellow">Regras que Salvam Vidas</div>
            <ul className="regras-list">
              {regrasSalvamVidas.map((r, i) => (
                <li key={i}>
                  <span className="regra-bullet">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COL 2 — Segurança direita */}
        <div className="vpo-col col-seg-right">

          {/* SIF Fluxo */}
          <div className="vpo-card">
            <div className="vpo-card-label gray">SIF</div>
            <ImageCard src={imagens.sifFluxo} label="Fluxo SIF" />
          </div>

          {/* Precursores de SIF */}
          <div className="vpo-card precursores-card">
            <div className="vpo-card-label gray">Precursores de SIF</div>
            <div className="precursores-body">
              <div className="precursores-itens">
                {precursoresSIF.itens.map((item, i) => (
                  <p key={i} className="precursor-item">• {item}</p>
                ))}
              </div>
              <div className="precursores-ivs">
                <p className="ivs-titulo">IVs Preventivos</p>
                {precursoresSIF.ivs.map((iv, i) => (
                  <p key={i} className="iv-item">• {iv}</p>
                ))}
              </div>
              <div className="precursores-chart">
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={precursoresSIF.valores} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
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

          {/* Alerta de Segurança */}
          <div className="vpo-card">
            <div className="vpo-card-label yellow">Alertas de Segurança</div>
            <ImageCard src={imagens.alertaSeguranca} label="Alerta de Segurança" />
          </div>
        </div>

        {/* COL 3 — Gente */}
        <div className="vpo-col col-gente">

          {/* Engagement */}
          <div className="vpo-card engagement-card">
            <div className="vpo-card-label green">Engagement</div>
            <div className="engagement-body">
              <p className="eng-label">Processo</p>
              <p className="eng-value">{engagement.processo}%</p>
              <p className="eng-label">Eficiência do Gestor</p>
              <p className="eng-value">{engagement.eficienciaGestor}%</p>
              {engagement.assinatura && (
                <p className="eng-assinatura">{engagement.assinatura}</p>
              )}
            </div>
          </div>

          {/* Banco de Horas */}
          <div className="vpo-card lista-card">
            <div className="vpo-card-label gray">Banco de Horas</div>
            <ul className="lista-nomes">
              {bancoHoras.map((item) => (
                <li key={item.id}>
                  <span className="lista-data">{item.data}</span>
                  <span className="lista-nome">{item.nome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ordens SEG */}
          <div className="vpo-card lista-card">
            <div className="vpo-card-label gray">Ordens SEG</div>
            <ul className="lista-nomes">
              {ordensSeg.map((item) => (
                <li key={item.id}>
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

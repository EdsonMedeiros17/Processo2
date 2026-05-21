import React, { createContext, useContext, useState } from 'react';

const defaultData = {
  engagement: {
    processo: '98',
    eficienciaGestor: '100',
    assinatura: 'Pereira Jan / Jun',
  },
  bancoHoras: [
    { id: 1, data: '13/06', nome: 'Matheus' },
    { id: 2, data: '24/05', nome: 'Fábio' },
    { id: 3, data: '20/06', nome: 'Marcos' },
  ],
  ordensSeg: [
    { id: 1, data: '07/06', nome: 'Sandão' },
    { id: 2, data: '07/07', nome: 'Sandra' },
    { id: 3, data: '15/07', nome: 'Jorge' },
  ],
  regrasSalvamVidas: [
    'Substâncias Perigosas',
    'SAM / LOTOTO',
    'Trabalho em Altura',
    'Permissão de Trabalho',
    'Eletricidade',
    'Distância Segura',
  ],
  precursoresSIF: {
    itens: [
      'Vazamento em Camisa de Eletrodo',
      'Entupimento de Transporte',
    ],
    ivs: [
      'Temp. dos Elevadores',
      'Umidade Areia / MP',
      'Tempo de Descarga',
    ],
    valores: [
      { mes: '1', valor: 5 },
      { mes: '2', valor: 3 },
      { mes: '3', valor: 7 },
      { mes: '4', valor: 4 },
      { mes: '5', valor: 6 },
      { mes: '6', valor: 8 },
    ],
  },
  imagens: {
    inventarioSIF: null,
    sifFluxo: null,
    championForno: null,
    alertaSeguranca: null,
  },
  estilo: {
    corHeader: '#1a1a2e',
    corHeaderGente: '#1a3a2e',
    corLabelYellow: '#ffe600',
    corLabelOrange: '#ff8c00',
    corLabelGray: '#555555',
    corLabelGreen: '#1a5c2e',
    corEngagementValor: '#1565c0',
    corRegrasBullet: '#e53935',
    corFundo: '#f5f5f0',
    fonteTitulos: 'Syne',
    tamanhoEngagement: '2.2',
    tamanhoRegras: '0.95',
    tamanhoListas: '0.82',
  },
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('vpo_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // merge estilo para garantir novos campos
        parsed.estilo = { ...defaultData.estilo, ...(parsed.estilo || {}) };
        return parsed;
      }
    } catch {}
    return defaultData;
  });

  const updateData = (newData) => {
    setData(newData);
    try { localStorage.setItem('vpo_data', JSON.stringify(newData)); } catch {}
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

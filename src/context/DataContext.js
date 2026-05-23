import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

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
const DOC_REF = () => doc(db, 'vpo', 'quadro');

export function DataProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(DOC_REF(), (snap) => {
      if (snap.exists()) {
        const remoto = snap.data();
        remoto.estilo = { ...defaultData.estilo, ...(remoto.estilo || {}) };
        setData(remoto);
      } else {
        setDoc(DOC_REF(), defaultData);
      }
      setCarregando(false);
    }, (error) => {
      console.error('Firebase erro:', error);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  const updateData = async (novoData) => {
    setData(novoData);
    try {
      await setDoc(DOC_REF(), novoData);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, carregando }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

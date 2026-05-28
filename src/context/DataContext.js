import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const defaultData = {
  territorioSeguro: [
    { id: 1, nome: 'Forno', nivel: '3', acaoFoco: 'Manter monitoramento diário' },
  ],
  alertasSeguranca: [
    { id: 1, unidade: 'Forno', ocorrencia: 'Vazamento identificado', acaoAplicavel: 'Isolamento imediato', data: '13/06' },
  ],
  ordensSeg: [
    { id: 1, data: '07/06', ordem: 'OS-001', texto: 'Inspeção elétrica painel', status: 'Concluído' },
    { id: 2, data: '07/07', ordem: 'OS-002', texto: 'Troca EPI setor A', status: 'Pendente' },
    { id: 3, data: '15/07', ordem: 'OS-003', texto: 'Revisão extintores', status: 'Em andamento' },
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
      { id: 1, nome: 'Vazamento em Camisa de Eletrodo' },
      { id: 2, nome: 'Entupimento de Transporte' },
    ],
    valores: [
      { mes: 'Jan', valor: 5 },
      { mes: 'Fev', valor: 3 },
      { mes: 'Mar', valor: 7 },
      { mes: 'Abr', valor: 4 },
      { mes: 'Mai', valor: 6 },
      { mes: 'Jun', valor: 8 },
    ],
  },
  ivsPreventivos: {
    itens: [
      { id: 1, nome: 'Temp. dos Elevadores' },
      { id: 2, nome: 'Umidade Areia / MP' },
      { id: 3, nome: 'Tempo de Descarga' },
    ],
    valores: [
      { mes: 'Jan', valor: 4 },
      { mes: 'Fev', valor: 6 },
      { mes: 'Mar', valor: 5 },
      { mes: 'Abr', valor: 7 },
      { mes: 'Mai', valor: 3 },
      { mes: 'Jun', valor: 6 },
    ],
  },
  championForno: [
    { id: 1, nome: 'João Silva', funcao: 'Operador', turno: 'A' },
    { id: 2, nome: 'Maria Santos', funcao: 'Técnica', turno: 'B' },
  ],
  gestaoTS: {
    texto: 'Acesse os padrões e informações de segurança abaixo:',
    links: [
      { id: 1, titulo: 'Padrão Operacional TS-01', url: 'https://' },
    ],
  },
  imagens: {
    alertaSeguranca: null,
  },
  estilo: {
    corHeader: '#1a1a2e',
    corHeaderGente: '#1a3a2e',
    corLabelYellow: '#ffe600',
    corLabelOrange: '#ff8c00',
    corLabelGray: '#555555',
    corLabelGreen: '#1a5c2e',
    corLabelBlue: '#1565c0',
    corEngagementValor: '#1565c0',
    corRegrasBullet: '#e53935',
    corFundo: '#f5f5f0',
    fonteTitulos: 'Syne',
    tamanhoEngagement: '1.4',
    tamanhoRegras: '0.95',
    tamanhoListas: '0.82',
    tituloGente: 'GENTE',
    tituloChampion: 'Champion Forno',
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
        remoto.estilo = { ...defaultData.estilo, ...(remoto.estilo || {}), tituloGente: (remoto.estilo || {}).tituloGente || defaultData.estilo.tituloGente, tituloChampion: (remoto.estilo || {}).tituloChampion || defaultData.estilo.tituloChampion };
        // migrate old data structure
        if (!remoto.territorioSeguro) remoto.territorioSeguro = defaultData.territorioSeguro;
        // migrate old nivel text values to numbers
        const nivelMigrar = { 'Verde': '4', 'Amarelo': '2', 'Vermelho': '1', 'Laranja': '2', 'Azul': '3', 'Roxo': '4' };
        remoto.territorioSeguro = remoto.territorioSeguro.map(ts => ({
          ...ts,
          nivel: nivelMigrar[ts.nivel] !== undefined ? nivelMigrar[ts.nivel] : ts.nivel
        }));
        if (!remoto.alertasSeguranca) remoto.alertasSeguranca = defaultData.alertasSeguranca;
        if (!remoto.championForno) remoto.championForno = defaultData.championForno;
        if (!remoto.gestaoTS) remoto.gestaoTS = defaultData.gestaoTS;
        if (!remoto.ivsPreventivos) remoto.ivsPreventivos = defaultData.ivsPreventivos;
        if (!remoto.ordensSeg) remoto.ordensSeg = defaultData.ordensSeg;
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

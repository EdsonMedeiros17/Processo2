import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import VPODashboard from './pages/VPODashboard';
import Admin from './admin/Admin';
import Login from './admin/Login';
import './App.css';

function AppInner() {
  const [modo, setModo] = useState('dashboard');
  const { usuario, isAdmin, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Carregando...</p>
      </div>
    );
  }

  // Se clicou em Admin mas não está logado, mostra Login
  if (modo === 'admin' && !usuario) {
    return <Login onVoltar={() => setModo('dashboard')} />;
  }

  // Se está logado mas não tem perfil válido
  if (modo === 'admin' && usuario && !isAdmin) {
    return (
      <div className="loading-screen">
        <p>Acesso não autorizado.</p>
        <button onClick={() => setModo('dashboard')} style={{ marginTop: 16, padding: '8px 20px', cursor: 'pointer' }}>
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="app-vpo">
      {modo === 'dashboard' && (
        <>
          <VPODashboard />
          <button
            className="btn-admin-acesso"
            onClick={() => setModo('admin')}
            title="Acessar painel admin"
          >
            ⚙️ Admin
          </button>
        </>
      )}
      {modo === 'admin' && usuario && isAdmin && (
        <Admin onSair={() => setModo('dashboard')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppInner />
      </DataProvider>
    </AuthProvider>
  );
}

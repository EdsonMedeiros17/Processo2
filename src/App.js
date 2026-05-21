import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import VPODashboard from './pages/VPODashboard';
import Admin from './admin/Admin';
import './App.css';

function AppInner() {
  const [modo, setModo] = useState('dashboard'); // 'dashboard' | 'admin'

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
      {modo === 'admin' && (
        <Admin onSair={() => setModo('dashboard')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}

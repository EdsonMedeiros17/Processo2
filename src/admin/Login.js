import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, recuperarSenha } = useAuth();
  const [modo, setModo] = useState('login'); // 'login' | 'recuperar'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) return setErro('Preencha e-mail e senha.');
    setErro(''); setCarregando(true);
    try {
      await login(email, senha);
    } catch (e) {
      setErro('E-mail ou senha incorretos.');
    }
    setCarregando(false);
  };

  const handleRecuperar = async () => {
    if (!email) return setErro('Digite seu e-mail para recuperação.');
    setErro(''); setCarregando(true);
    try {
      await recuperarSenha(email);
      setSucesso('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (e) {
      setErro('E-mail não encontrado.');
    }
    setCarregando(false);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">🛡️</div>
        <h1>Portal Admin</h1>
        <p>Quadro VPO — Ambev</p>

        {modo === 'login' ? (
          <>
            <input
              type="email" placeholder="E-mail" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password" placeholder="Senha" value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {erro && <p className="login-erro">{erro}</p>}
            <button onClick={handleLogin} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
            <button className="btn-link" onClick={() => { setModo('recuperar'); setErro(''); setSucesso(''); }}>
              Esqueci minha senha
            </button>
          </>
        ) : (
          <>
            <p className="login-info">Digite seu e-mail para receber o link de recuperação.</p>
            <input
              type="email" placeholder="E-mail" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRecuperar()}
            />
            {erro && <p className="login-erro">{erro}</p>}
            {sucesso && <p className="login-sucesso">{sucesso}</p>}
            <button onClick={handleRecuperar} disabled={carregando}>
              {carregando ? 'Enviando...' : 'Enviar e-mail'}
            </button>
            <button className="btn-link" onClick={() => { setModo('login'); setErro(''); setSucesso(''); }}>
              ← Voltar ao login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

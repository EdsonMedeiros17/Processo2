import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './GerenciarAdmins.css';

export default function GerenciarAdmins({ onVoltar }) {
  const { cadastrarAdmin, listarAdmins, removerAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const lista = await listarAdmins();
    setAdmins(lista);
  };

  const handleCadastrar = async () => {
    if (!form.nome || !form.email || !form.senha) return setErro('Preencha todos os campos.');
    if (form.senha.length < 6) return setErro('Senha deve ter pelo menos 6 caracteres.');
    setErro(''); setCarregando(true);
    try {
      await cadastrarAdmin(form.email, form.senha, form.nome);
      setSucesso(`Admin "${form.nome}" cadastrado com sucesso!`);
      setForm({ nome: '', email: '', senha: '' });
      await carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (e) {
      setErro(e.message.includes('email-already') ? 'E-mail já cadastrado.' : 'Erro ao cadastrar. Tente novamente.');
    }
    setCarregando(false);
  };

  const handleRemover = async (uid, nome) => {
    if (!window.confirm(`Remover acesso de "${nome}"?`)) return;
    await removerAdmin(uid);
    await carregar();
  };

  return (
    <div className="ga-root">
      <div className="ga-header">
        <button className="ga-voltar" onClick={onVoltar}>← Voltar ao Admin</button>
        <h1>👥 Gerenciar Admins</h1>
      </div>

      {/* Cadastrar novo */}
      <div className="ga-card">
        <h2>Cadastrar novo admin</h2>
        <div className="ga-form">
          <div className="form-group">
            <label>Nome</label>
            <input type="text" placeholder="Nome completo" value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="email@empresa.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Senha inicial</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={form.senha}
              onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} />
          </div>
        </div>
        {erro && <p className="ga-erro">{erro}</p>}
        {sucesso && <p className="ga-sucesso">{sucesso}</p>}
        <button className="ga-btn-cadastrar" onClick={handleCadastrar} disabled={carregando}>
          {carregando ? 'Cadastrando...' : '+ Cadastrar Admin'}
        </button>
      </div>

      {/* Lista de admins */}
      <div className="ga-card">
        <h2>Admins cadastrados</h2>
        {admins.length === 0 ? (
          <p className="ga-vazio">Nenhum admin cadastrado ainda.</p>
        ) : (
          <div className="ga-lista">
            {admins.map(a => (
              <div key={a.id} className="ga-row">
                <div className="ga-avatar">{a.nome.charAt(0)}</div>
                <div className="ga-info">
                  <p className="ga-nome">{a.nome}</p>
                  <p className="ga-email">{a.email}</p>
                </div>
                <button className="ga-btn-remover" onClick={() => handleRemover(a.id, a.nome)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

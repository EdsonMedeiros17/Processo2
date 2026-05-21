import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Admin.css';

const SENHA = 'ambev2025';

export default function Admin({ onSair }) {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [aba, setAba] = useState('engagement');
  const [salvo, setSalvo] = useState(false);

  const { data, updateData } = useData();

  const login = () => {
    if (senha === SENHA) {
      setAutenticado(true);
      setErroSenha(false);
    } else {
      setErroSenha(true);
    }
  };

  const salvar = (novoData) => {
    updateData(novoData);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  if (!autenticado) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <div className="login-logo">🛡️</div>
          <h1>Portal Admin</h1>
          <p>Quadro VPO — Ambev</p>
          <input
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className={erroSenha ? 'erro' : ''}
          />
          {erroSenha && <p className="erro-msg">Senha incorreta</p>}
          <button onClick={login}>Entrar</button>
          <button className="btn-voltar" onClick={onSair}>← Voltar ao quadro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>🛡️</span>
          <span>Admin VPO</span>
        </div>
        {[
          { id: 'engagement', label: '📊 Engagement' },
          { id: 'banco', label: '⏰ Banco de Horas' },
          { id: 'ordens', label: '📋 Ordens SEG' },
          { id: 'regras', label: '⚠️ Regras que Salvam Vidas' },
          { id: 'precursores', label: '🔬 Precursores de SIF' },
          { id: 'imagens', label: '🖼️ Imagens' },
        ].map(item => (
          <button
            key={item.id}
            className={`admin-nav-btn ${aba === item.id ? 'ativo' : ''}`}
            onClick={() => setAba(item.id)}
          >
            {item.label}
          </button>
        ))}
        <div className="admin-sidebar-footer">
          <button className="btn-voltar-quadro" onClick={onSair}>← Ver Quadro</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2>{
            { engagement: 'Engagement', banco: 'Banco de Horas', ordens: 'Ordens SEG', regras: 'Regras que Salvam Vidas', precursores: 'Precursores de SIF', imagens: 'Imagens' }[aba]
          }</h2>
          {salvo && <span className="salvo-badge">✅ Salvo!</span>}
        </div>

        <div className="admin-content">
          {aba === 'engagement' && <AbaEngagement data={data} salvar={salvar} />}
          {aba === 'banco' && <AbaLista chave="bancoHoras" label="Banco de Horas" data={data} salvar={salvar} />}
          {aba === 'ordens' && <AbaLista chave="ordensSeg" label="Ordens SEG" data={data} salvar={salvar} />}
          {aba === 'regras' && <AbaRegras data={data} salvar={salvar} />}
          {aba === 'precursores' && <AbaPrecursores data={data} salvar={salvar} />}
          {aba === 'imagens' && <AbaImagens data={data} salvar={salvar} />}
        </div>
      </main>
    </div>
  );
}

/* ── Engagement ── */
function AbaEngagement({ data, salvar }) {
  const [form, setForm] = useState({ ...data.engagement });

  const handleChange = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSalvar = () => salvar({ ...data, engagement: form });

  return (
    <div className="aba-form">
      <div className="form-group">
        <label>Processo (%)</label>
        <input type="number" min="0" max="100" value={form.processo} onChange={e => handleChange('processo', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Eficiência do Gestor (%)</label>
        <input type="number" min="0" max="100" value={form.eficienciaGestor} onChange={e => handleChange('eficienciaGestor', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Assinatura / Período</label>
        <input type="text" value={form.assinatura} onChange={e => handleChange('assinatura', e.target.value)} placeholder="Ex: Pereira Jan / Jun" />
      </div>
      <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
    </div>
  );
}

/* ── Lista genérica (Banco de Horas / Ordens SEG) ── */
function AbaLista({ chave, label, data, salvar }) {
  const [itens, setItens] = useState([...data[chave]]);

  const adicionar = () => setItens(prev => [...prev, { id: Date.now(), data: '', nome: '' }]);

  const remover = (id) => setItens(prev => prev.filter(i => i.id !== id));

  const atualizar = (id, campo, valor) => setItens(prev =>
    prev.map(i => i.id === id ? { ...i, [campo]: valor } : i)
  );

  const handleSalvar = () => salvar({ ...data, [chave]: itens });

  return (
    <div className="aba-lista">
      <p className="aba-desc">Gerencie os registros de {label}.</p>
      <table className="lista-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Nome</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  value={item.data}
                  onChange={e => atualizar(item.id, 'data', e.target.value)}
                  placeholder="Ex: 13/06"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.nome}
                  onChange={e => atualizar(item.id, 'nome', e.target.value)}
                  placeholder="Nome"
                />
              </td>
              <td>
                <button className="btn-remover" onClick={() => remover(item.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Adicionar linha</button>
        <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Regras que Salvam Vidas ── */
function AbaRegras({ data, salvar }) {
  const [regras, setRegras] = useState([...data.regrasSalvamVidas]);

  const atualizar = (i, val) => setRegras(prev => prev.map((r, idx) => idx === i ? val : r));
  const adicionar = () => setRegras(prev => [...prev, '']);
  const remover = (i) => setRegras(prev => prev.filter((_, idx) => idx !== i));
  const handleSalvar = () => salvar({ ...data, regrasSalvamVidas: regras });

  return (
    <div className="aba-lista">
      <p className="aba-desc">Lista de regras exibidas no quadro.</p>
      <div className="regras-admin-list">
        {regras.map((r, i) => (
          <div key={i} className="regra-admin-row">
            <span className="regra-num">{i + 1}.</span>
            <input
              type="text"
              value={r}
              onChange={e => atualizar(i, e.target.value)}
              placeholder="Regra..."
            />
            <button className="btn-remover" onClick={() => remover(i)}>✕</button>
          </div>
        ))}
      </div>
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Adicionar regra</button>
        <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Precursores de SIF ── */
function AbaPrecursores({ data, salvar }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(data.precursoresSIF)));

  const atualizarItem = (i, val) => setForm(f => ({ ...f, itens: f.itens.map((x, idx) => idx === i ? val : x) }));
  const adicionarItem = () => setForm(f => ({ ...f, itens: [...f.itens, ''] }));
  const removerItem = (i) => setForm(f => ({ ...f, itens: f.itens.filter((_, idx) => idx !== i) }));

  const atualizarIV = (i, val) => setForm(f => ({ ...f, ivs: f.ivs.map((x, idx) => idx === i ? val : x) }));
  const adicionarIV = () => setForm(f => ({ ...f, ivs: [...f.ivs, ''] }));
  const removerIV = (i) => setForm(f => ({ ...f, ivs: f.ivs.filter((_, idx) => idx !== i) }));

  const atualizarValor = (i, campo, val) => setForm(f => ({
    ...f,
    valores: f.valores.map((v, idx) => idx === i ? { ...v, [campo]: campo === 'valor' ? Number(val) : val } : v)
  }));

  const handleSalvar = () => salvar({ ...data, precursoresSIF: form });

  return (
    <div className="aba-lista">
      <h3>Itens Precursores</h3>
      {form.itens.map((item, i) => (
        <div key={i} className="regra-admin-row">
          <input type="text" value={item} onChange={e => atualizarItem(i, e.target.value)} placeholder="Precursor..." />
          <button className="btn-remover" onClick={() => removerItem(i)}>✕</button>
        </div>
      ))}
      <button className="btn-adicionar" onClick={adicionarItem}>+ Item</button>

      <h3 style={{ marginTop: '1.5rem' }}>IVs Preventivos</h3>
      {form.ivs.map((iv, i) => (
        <div key={i} className="regra-admin-row">
          <input type="text" value={iv} onChange={e => atualizarIV(i, e.target.value)} placeholder="IV..." />
          <button className="btn-remover" onClick={() => removerIV(i)}>✕</button>
        </div>
      ))}
      <button className="btn-adicionar" onClick={adicionarIV}>+ IV</button>

      <h3 style={{ marginTop: '1.5rem' }}>Valores do Gráfico</h3>
      <table className="lista-table">
        <thead><tr><th>Mês</th><th>Valor</th></tr></thead>
        <tbody>
          {form.valores.map((v, i) => (
            <tr key={i}>
              <td><input type="text" value={v.mes} onChange={e => atualizarValor(i, 'mes', e.target.value)} style={{ width: 60 }} /></td>
              <td><input type="number" value={v.valor} onChange={e => atualizarValor(i, 'valor', e.target.value)} style={{ width: 80 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="lista-actions" style={{ marginTop: '1rem' }}>
        <button className="btn-salvar" onClick={handleSalvar}>Salvar tudo</button>
      </div>
    </div>
  );
}

/* ── Imagens ── */
function AbaImagens({ data, salvar }) {
  const campos = [
    { chave: 'inventarioSIF', label: 'Inventário de SIFs' },
    { chave: 'sifFluxo', label: 'SIF — Fluxo Visual' },
    { chave: 'championForno', label: 'Champion Forno' },
    { chave: 'alertaSeguranca', label: 'Alerta de Segurança' },
  ];

  const handleImagem = (chave, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const novas = { ...data.imagens, [chave]: e.target.result };
      salvar({ ...data, imagens: novas });
    };
    reader.readAsDataURL(file);
  };

  const removerImagem = (chave) => {
    const novas = { ...data.imagens, [chave]: null };
    salvar({ ...data, imagens: novas });
  };

  return (
    <div className="aba-imagens">
      <p className="aba-desc">Faça upload das imagens para cada quadrante. Formatos aceitos: JPG, PNG, PDF (como imagem).</p>
      <div className="imagens-grid">
        {campos.map(({ chave, label }) => (
          <div key={chave} className="imagem-card">
            <p className="imagem-label">{label}</p>
            {data.imagens[chave] ? (
              <div className="imagem-preview">
                <img src={data.imagens[chave]} alt={label} />
                <button className="btn-remover-img" onClick={() => removerImagem(chave)}>✕ Remover</button>
              </div>
            ) : (
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImagem(chave, e.target.files[0])}
                />
                <span className="upload-icon">📁</span>
                <span>Clique para enviar</span>
                <span className="upload-hint">JPG, PNG até 5MB</span>
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

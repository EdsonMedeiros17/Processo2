import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GerenciarAdmins from './GerenciarAdmins';
import { useData } from '../context/DataContext';
import './Admin.css';

export default function Admin({ onSair }) {
  const [aba, setAba] = useState('ts');
  const [salvo, setSalvo] = useState(false);
  const [gerenciarAdmins, setGerenciarAdmins] = useState(false);
  const { data, updateData } = useData();
  const { usuario, logout, isSuperAdmin } = useAuth();

  const salvar = (novoData) => {
    updateData(novoData);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const handleLogout = async () => { await logout(); onSair(); };

  if (gerenciarAdmins && isSuperAdmin) {
    return <GerenciarAdmins onVoltar={() => setGerenciarAdmins(false)} />;
  }

  const abas = [
    { id: 'ts', label: '🎯 Território Seguro' },
    { id: 'alertas', label: '🚨 Alertas de Segurança' },
    { id: 'ordens', label: '📋 Ordens de Segurança' },
    { id: 'regras', label: '⚠️ Regras que Salvam Vidas' },
    { id: 'precursores', label: '🔬 SIF Precursores' },
    { id: 'ivs', label: '📊 IVs Preventivos' },
    { id: 'champion', label: '🏆 Champion Forno' },
    { id: 'gestaots', label: '📁 Gestão de TS' },
    { id: 'estilo', label: '🎨 Personalização' },
    { id: 'senha', label: '🔑 Alterar Senha' },
  ];

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-logo"><span>🛡️</span><span>Admin VPO</span></div>
        <div className="admin-user-info">
          <span className="admin-user-email">{usuario?.email}</span>
        </div>
        {abas.map(item => (
          <button key={item.id}
            className={`admin-nav-btn ${aba === item.id ? 'ativo' : ''}`}
            onClick={() => setAba(item.id)}>
            {item.label}
          </button>
        ))}
        {isSuperAdmin && (
          <button className="admin-nav-btn admin-nav-superadmin" onClick={() => setGerenciarAdmins(true)}>
            👥 Gerenciar Admins
          </button>
        )}
        <div className="admin-sidebar-footer">
          <button className="btn-voltar-quadro" onClick={onSair}>← Ver Quadro</button>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2>{abas.find(a => a.id === aba)?.label}</h2>
          {salvo && <span className="salvo-badge">✅ Salvo!</span>}
        </div>
        <div className="admin-content">
          {aba === 'ts'         && <AbaTS data={data} salvar={salvar} />}
          {aba === 'alertas'    && <AbaAlertas data={data} salvar={salvar} />}
          {aba === 'ordens'     && <AbaOrdens data={data} salvar={salvar} />}
          {aba === 'regras'     && <AbaRegras data={data} salvar={salvar} />}
          {aba === 'precursores'&& <AbaPrecursores data={data} salvar={salvar} />}
          {aba === 'ivs'        && <AbaIVs data={data} salvar={salvar} />}
          {aba === 'champion'   && <AbaChampion data={data} salvar={salvar} />}
          {aba === 'gestaots'   && <AbaGestaoTS data={data} salvar={salvar} />}
          {aba === 'estilo'     && <AbaEstilo data={data} salvar={salvar} />}
          {aba === 'senha'      && <AbaAlterarSenha />}
        </div>
      </main>
    </div>
  );
}

/* ── Território Seguro ── */
function AbaTS({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.territorioSeguro || [])));
  const adicionar = () => setItens(p => [...p, { id: Date.now(), nome: '', nivel: 'Verde', acaoFoco: '' }]);
  const remover = (id) => setItens(p => p.filter(i => i.id !== id));
  const atualizar = (id, campo, val) => setItens(p => p.map(i => i.id === id ? { ...i, [campo]: val } : i));
  return (
    <div className="aba-lista">
      <p className="aba-desc">Gerencie os Territórios Seguros exibidos no quadro.</p>
      {itens.map(item => (
        <div key={item.id} className="ts-admin-row">
          <div className="form-row-3">
            <div className="form-group">
              <label>Nome do TS</label>
              <input type="text" value={item.nome} onChange={e => atualizar(item.id, 'nome', e.target.value)} placeholder="Ex: Forno" />
            </div>
            <div className="form-group">
              <label>Nível</label>
              <select value={item.nivel} onChange={e => atualizar(item.id, 'nivel', e.target.value)}>
                <option value="0">0 — Preto</option>
                <option value="1">1 — Vermelho</option>
                <option value="2">2 — Laranja</option>
                <option value="3">3 — Azul</option>
                <option value="4">4 — Roxo</option>
              </select>
            </div>
            <button className="btn-remover" onClick={() => remover(item.id)}>✕</button>
          </div>
          <div className="form-group">
            <label>Ação Foco</label>
            <input type="text" value={item.acaoFoco} onChange={e => atualizar(item.id, 'acaoFoco', e.target.value)} placeholder="Descreva a ação foco..." />
          </div>
        </div>
      ))}
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Novo TS</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, territorioSeguro: itens })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Alertas de Segurança ── */
function AbaAlertas({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.alertasSeguranca || [])));
  const adicionar = () => setItens(p => [...p, { id: Date.now(), unidade: '', ocorrencia: '', acaoAplicavel: '', data: '' }]);
  const remover = (id) => setItens(p => p.filter(i => i.id !== id));
  const atualizar = (id, campo, val) => setItens(p => p.map(i => i.id === id ? { ...i, [campo]: val } : i));
  return (
    <div className="aba-lista">
      <p className="aba-desc">Gerencie os alertas de segurança exibidos no quadro.</p>
      {itens.map(item => (
        <div key={item.id} className="ts-admin-row">
          <div className="form-row-3">
            <div className="form-group">
              <label>Unidade</label>
              <input type="text" value={item.unidade} onChange={e => atualizar(item.id, 'unidade', e.target.value)} placeholder="Ex: Forno" />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="text" value={item.data} onChange={e => atualizar(item.id, 'data', e.target.value)} placeholder="Ex: 13/06" />
            </div>
            <button className="btn-remover" onClick={() => remover(item.id)}>✕</button>
          </div>
          <div className="form-group">
            <label>Ocorrência</label>
            <input type="text" value={item.ocorrencia} onChange={e => atualizar(item.id, 'ocorrencia', e.target.value)} placeholder="Descreva a ocorrência..." />
          </div>
          <div className="form-group">
            <label>Ação Aplicável</label>
            <input type="text" value={item.acaoAplicavel} onChange={e => atualizar(item.id, 'acaoAplicavel', e.target.value)} placeholder="Descreva a ação..." />
          </div>
        </div>
      ))}
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Novo Alerta</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, alertasSeguranca: itens })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Ordens de Segurança ── */
function AbaOrdens({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.ordensSeg || [])));
  const adicionar = () => setItens(p => [...p, { id: Date.now(), data: '', ordem: '', texto: '', status: 'Pendente' }]);
  const remover = (id) => setItens(p => p.filter(i => i.id !== id));
  const atualizar = (id, campo, val) => setItens(p => p.map(i => i.id === id ? { ...i, [campo]: val } : i));
  return (
    <div className="aba-lista">
      <p className="aba-desc">Gerencie as ordens de segurança.</p>
      {itens.map(item => (
        <div key={item.id} className="ts-admin-row">
          <div className="form-row-4">
            <div className="form-group">
              <label>Data</label>
              <input type="text" value={item.data} onChange={e => atualizar(item.id, 'data', e.target.value)} placeholder="13/06" />
            </div>
            <div className="form-group">
              <label>Ordem</label>
              <input type="text" value={item.ordem} onChange={e => atualizar(item.id, 'ordem', e.target.value)} placeholder="OS-001" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={item.status} onChange={e => atualizar(item.id, 'status', e.target.value)}>
                <option>Pendente</option>
                <option>Em andamento</option>
                <option>Concluído</option>
                <option>Cancelado</option>
              </select>
            </div>
            <button className="btn-remover" onClick={() => remover(item.id)}>✕</button>
          </div>
          <div className="form-group">
            <label>Texto</label>
            <input type="text" value={item.texto} onChange={e => atualizar(item.id, 'texto', e.target.value)} placeholder="Descrição da ordem..." />
          </div>
        </div>
      ))}
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Nova Ordem</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, ordensSeg: itens })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Regras ── */
function AbaRegras({ data, salvar }) {
  const [regras, setRegras] = useState([...data.regrasSalvamVidas]);
  return (
    <div className="aba-lista">
      <p className="aba-desc">Lista de regras exibidas no quadro.</p>
      <div className="regras-admin-list">
        {regras.map((r, i) => (
          <div key={i} className="regra-admin-row">
            <span className="regra-num">{i + 1}.</span>
            <input type="text" value={r} onChange={e => setRegras(p => p.map((x, idx) => idx === i ? e.target.value : x))} placeholder="Regra..." />
            <button className="btn-remover" onClick={() => setRegras(p => p.filter((_, idx) => idx !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={() => setRegras(p => [...p, ''])}>+ Adicionar</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, regrasSalvamVidas: regras })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── SIF Precursores ── */
function AbaPrecursores({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.precursoresSIF?.itens || [])));
  const [valores, setValores] = useState(JSON.parse(JSON.stringify(data.precursoresSIF?.valores || [])));
  const atualizarValor = (i, campo, val) => setValores(p => p.map((v, idx) => idx === i ? { ...v, [campo]: campo === 'valor' ? Number(val) : val } : v));
  return (
    <div className="aba-lista">
      <h3>Itens</h3>
      {itens.map((item, i) => (
        <div key={item.id} className="regra-admin-row">
          <input type="text" value={item.nome} onChange={e => setItens(p => p.map((x, idx) => idx === i ? { ...x, nome: e.target.value } : x))} placeholder="Precursor..." />
          <button className="btn-remover" onClick={() => setItens(p => p.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="btn-adicionar" onClick={() => setItens(p => [...p, { id: Date.now(), nome: '' }])}>+ Item</button>
      <h3 style={{ marginTop: '1.5rem' }}>Valores do Gráfico</h3>
      <table className="lista-table">
        <thead><tr><th>Mês</th><th>Valor</th></tr></thead>
        <tbody>
          {valores.map((v, i) => (
            <tr key={i}>
              <td><input type="text" value={v.mes} onChange={e => atualizarValor(i, 'mes', e.target.value)} style={{ width: 60 }} /></td>
              <td><input type="number" value={v.valor} onChange={e => atualizarValor(i, 'valor', e.target.value)} style={{ width: 80 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lista-actions" style={{ marginTop: '1rem' }}>
        <button className="btn-salvar" onClick={() => salvar({ ...data, precursoresSIF: { itens, valores } })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── IVs Preventivos ── */
function AbaIVs({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.ivsPreventivos?.itens || [])));
  const [valores, setValores] = useState(JSON.parse(JSON.stringify(data.ivsPreventivos?.valores || [])));
  const atualizarValor = (i, campo, val) => setValores(p => p.map((v, idx) => idx === i ? { ...v, [campo]: campo === 'valor' ? Number(val) : val } : v));
  return (
    <div className="aba-lista">
      <h3>IVs</h3>
      {itens.map((item, i) => (
        <div key={item.id} className="regra-admin-row">
          <input type="text" value={item.nome} onChange={e => setItens(p => p.map((x, idx) => idx === i ? { ...x, nome: e.target.value } : x))} placeholder="IV..." />
          <button className="btn-remover" onClick={() => setItens(p => p.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="btn-adicionar" onClick={() => setItens(p => [...p, { id: Date.now(), nome: '' }])}>+ IV</button>
      <h3 style={{ marginTop: '1.5rem' }}>Valores do Gráfico</h3>
      <table className="lista-table">
        <thead><tr><th>Mês</th><th>Valor</th></tr></thead>
        <tbody>
          {valores.map((v, i) => (
            <tr key={i}>
              <td><input type="text" value={v.mes} onChange={e => atualizarValor(i, 'mes', e.target.value)} style={{ width: 60 }} /></td>
              <td><input type="number" value={v.valor} onChange={e => atualizarValor(i, 'valor', e.target.value)} style={{ width: 80 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lista-actions" style={{ marginTop: '1rem' }}>
        <button className="btn-salvar" onClick={() => salvar({ ...data, ivsPreventivos: { itens, valores } })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Champion Forno ── */
function AbaChampion({ data, salvar }) {
  const [itens, setItens] = useState(JSON.parse(JSON.stringify(data.championForno || [])));
  const adicionar = () => setItens(p => [...p, { id: Date.now(), nome: '', funcao: '', turno: 'A' }]);
  const remover = (id) => setItens(p => p.filter(i => i.id !== id));
  const atualizar = (id, campo, val) => setItens(p => p.map(i => i.id === id ? { ...i, [campo]: val } : i));
  return (
    <div className="aba-lista">
      <p className="aba-desc">Gerencie os membros do Champion Forno.</p>
      {itens.map(item => (
        <div key={item.id} className="ts-admin-row">
          <div className="form-row-4">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={item.nome} onChange={e => atualizar(item.id, 'nome', e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label>Função</label>
              <input type="text" value={item.funcao} onChange={e => atualizar(item.id, 'funcao', e.target.value)} placeholder="Ex: Operador" />
            </div>
            <div className="form-group">
              <label>Turno</label>
              <select value={item.turno} onChange={e => atualizar(item.id, 'turno', e.target.value)}>
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </div>
            <button className="btn-remover" onClick={() => remover(item.id)}>✕</button>
          </div>
        </div>
      ))}
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionar}>+ Novo Champion</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, championForno: itens })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Gestão de TS ── */
function AbaGestaoTS({ data, salvar }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(data.gestaoTS || { texto: '', links: [] })));
  const adicionarLink = () => setForm(f => ({ ...f, links: [...f.links, { id: Date.now(), titulo: '', url: '' }] }));
  const removerLink = (id) => setForm(f => ({ ...f, links: f.links.filter(l => l.id !== id) }));
  const atualizarLink = (id, campo, val) => setForm(f => ({ ...f, links: f.links.map(l => l.id === id ? { ...l, [campo]: val } : l) }));
  return (
    <div className="aba-lista">
      <p className="aba-desc">Edite as informações e links da caixa Gestão de TS.</p>
      <div className="form-group">
        <label>Texto de apresentação</label>
        <textarea value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
          placeholder="Descreva as informações de segurança..." rows={4} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', resize: 'vertical' }} />
      </div>
      <h3 style={{ marginTop: '1rem' }}>Links e Padrões</h3>
      {form.links.map(link => (
        <div key={link.id} className="ts-admin-row">
          <div className="form-row-3">
            <div className="form-group">
              <label>Título do link</label>
              <input type="text" value={link.titulo} onChange={e => atualizarLink(link.id, 'titulo', e.target.value)} placeholder="Ex: Padrão Operacional TS-01" />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input type="url" value={link.url} onChange={e => atualizarLink(link.id, 'url', e.target.value)} placeholder="https://..." />
            </div>
            <button className="btn-remover" onClick={() => removerLink(link.id)}>✕</button>
          </div>
        </div>
      ))}
      <div className="lista-actions">
        <button className="btn-adicionar" onClick={adicionarLink}>+ Novo Link</button>
        <button className="btn-salvar" onClick={() => salvar({ ...data, gestaoTS: form })}>Salvar</button>
      </div>
    </div>
  );
}

/* ── Estilo ── */
function AbaEstilo({ data, salvar }) {
  const [form, setForm] = useState({ ...data.estilo });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cores = [
    { k: 'corHeader', label: 'Cabeçalho Segurança' },
    { k: 'corHeaderGente', label: 'Cabeçalho Gente' },
    { k: 'corLabelYellow', label: 'Etiqueta Amarela' },
    { k: 'corLabelOrange', label: 'Etiqueta Laranja' },
    { k: 'corLabelGray', label: 'Etiqueta Cinza' },
    { k: 'corLabelGreen', label: 'Etiqueta Verde' },
    { k: 'corRegrasBullet', label: 'Bullets das Regras' },
    { k: 'corFundo', label: 'Fundo da Página' },
  ];
  const padrao = { corHeader: '#1a1a2e', corHeaderGente: '#1a3a2e', corLabelYellow: '#ffe600', corLabelOrange: '#ff8c00', corLabelGray: '#555555', corLabelGreen: '#1a5c2e', corRegrasBullet: '#e53935', corFundo: '#f5f5f0', fonteTitulos: 'Syne', tamanhoEngagement: '1.4', tamanhoRegras: '0.95', tamanhoListas: '0.82', tituloGente: 'GENTE', tituloChampion: 'Champion Forno' };
  return (
    <div className="aba-estilo">
      <p className="aba-desc">Personalize cores, fontes e tamanhos do quadro.</p>
      <div className="estilo-section">
        <h3>✏️ Títulos</h3>
        <div className="form-group">
          <label>Nome do cabeçalho "GENTE"</label>
          <input type="text" value={form.tituloGente || 'GENTE'} onChange={e => set('tituloGente', e.target.value)} placeholder="Ex: GENTE" />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Título da caixa Champion Forno</label>
          <input type="text" value={form.tituloChampion || 'Champion Forno'} onChange={e => set('tituloChampion', e.target.value)} placeholder="Ex: Champion Forno" />
        </div>
      </div>
      <div className="estilo-section">
        <h3>🎨 Cores</h3>
        <div className="cores-grid">
          {cores.map(({ k, label }) => (
            <div key={k} className="cor-item">
              <label>{label}</label>
              <div className="cor-input-row">
                <input type="color" value={form[k] || '#000000'} onChange={e => set(k, e.target.value)} />
                <input type="text" value={form[k] || ''} onChange={e => set(k, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="estilo-section">
        <h3>🔤 Fonte</h3>
        <div className="form-group">
          <label>Fonte dos Títulos</label>
          <select value={form.fonteTitulos} onChange={e => set('fonteTitulos', e.target.value)}>
            {['Syne','Arial','Georgia','Trebuchet MS','Verdana','Tahoma'].map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="estilo-section">
        <h3>📐 Tamanhos</h3>
        {[
          { k: 'tamanhoRegras', label: 'Texto das Regras', min: 0.6, max: 1.4 },
          { k: 'tamanhoListas', label: 'Texto das Listas', min: 0.6, max: 1.2 },
        ].map(({ k, label, min, max }) => (
          <div key={k} className="form-group">
            <label>{label}</label>
            <input type="range" min={min} max={max} step="0.05" value={form[k]} onChange={e => set(k, e.target.value)} />
            <span className="range-valor">{form[k]}rem</span>
          </div>
        ))}
      </div>
      <div className="estilo-actions">
        <button className="btn-salvar" onClick={() => salvar({ ...data, estilo: form })}>Salvar Personalização</button>
        <button className="btn-reset" onClick={() => { setForm(padrao); salvar({ ...data, estilo: padrao }); }}>Restaurar Padrão</button>
      </div>
    </div>
  );
}

/* ── Alterar Senha ── */
function AbaAlterarSenha() {
  const { alterarSenha } = useAuth();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleAlterar = async () => {
    setErro(''); setSucesso('');
    if (!novaSenha || !confirmar) return setErro('Preencha os dois campos.');
    if (novaSenha.length < 6) return setErro('Senha deve ter pelo menos 6 caracteres.');
    if (novaSenha !== confirmar) return setErro('As senhas não coincidem.');
    setCarregando(true);
    try {
      await alterarSenha(novaSenha);
      setSucesso('Senha alterada com sucesso!');
      setNovaSenha(''); setConfirmar('');
    } catch (e) {
      setErro('Erro ao alterar senha. Faça login novamente e tente.');
    }
    setCarregando(false);
  };

  return (
    <div className="aba-form">
      <p className="aba-desc">Altere sua senha de acesso ao painel admin.</p>
      <div className="form-group">
        <label>Nova Senha</label>
        <input type="password" placeholder="Mínimo 6 caracteres" value={novaSenha}
          onChange={e => setNovaSenha(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Confirmar Nova Senha</label>
        <input type="password" placeholder="Repita a nova senha" value={confirmar}
          onChange={e => setConfirmar(e.target.value)} />
      </div>
      {erro && <p style={{ color: '#c62828', fontSize: '0.78rem', fontWeight: 600 }}>{erro}</p>}
      {sucesso && <p style={{ color: '#2e7d32', fontSize: '0.78rem', fontWeight: 600 }}>{sucesso}</p>}
      <button className="btn-salvar" onClick={handleAlterar} disabled={carregando}>
        {carregando ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </div>
  );
}

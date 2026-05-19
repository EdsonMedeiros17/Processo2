# 🛡️ SecureDash — Security Dashboard

Dashboard de segurança web construída com React, hospedada gratuitamente na Vercel.

## 🚀 Como fazer o deploy (Vercel — Grátis)

### Passo 1 — Subir no GitHub

```bash
git init
git add .
git commit -m "feat: initial security dashboard"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/security-dashboard.git
git push -u origin main
```

### Passo 2 — Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e crie uma conta (pode usar o GitHub)
2. Clique em **"Add New Project"**
3. Selecione o repositório `security-dashboard`
4. Clique em **"Deploy"** — a Vercel detecta automaticamente o React

✅ Pronto! Em ~1 minuto seu site estará em: `https://security-dashboard-xxx.vercel.app`

### Passo 3 — Deploy automático

A partir de agora, todo `git push` faz o site atualizar automaticamente! 🎉

---

## 💻 Rodar localmente

```bash
npm install
npm start
```

Acesse: http://localhost:3000

---

## 📁 Estrutura

```
src/
├── components/
│   ├── Sidebar.js       # Menu lateral
│   └── Sidebar.css
├── pages/
│   ├── Dashboard.js     # Página principal
│   └── Dashboard.css
├── App.js               # Roteamento
├── App.css              # Layout
├── index.js             # Entry point
└── index.css            # Variáveis globais / tema
```

## 🎨 Tema

- Fundo escuro (navy/dark blue)
- Fontes: Syne (display) + JetBrains Mono (código)
- Paleta: Cyan, Green, Red, Yellow, Purple

# 🛡️ Quadro VPO — Ambev

## 🔥 Configurar o Firebase (OBRIGATÓRIO)

### Passo 1 — Criar projeto no Firebase
1. Acesse: https://console.firebase.google.com
2. Clique em **"Criar um projeto"**
3. Nome do projeto: `quadro-vpo` → clique em Continuar
4. Desative o Google Analytics → clique em **"Criar projeto"**

### Passo 2 — Criar o banco de dados (Firestore)
1. No menu lateral clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"**
4. Escolha a região: `southamerica-east1 (São Paulo)` → clique em **Ativar**

### Passo 3 — Obter as chaves do projeto
1. Clique na engrenagem ⚙️ → **"Configurações do projeto"**
2. Role até **"Seus aplicativos"** → clique em **"</> Web"**
3. Nome do app: `quadro-vpo` → clique em **"Registrar app"**
4. Vai aparecer um bloco com `firebaseConfig` — **copie esses valores**

### Passo 4 — Colar as chaves no código
Abra o arquivo `src/firebase.js` e substitua os campos:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // cole aqui
  authDomain: "quadro-vpo.firebaseapp.com",
  projectId: "quadro-vpo",
  storageBucket: "quadro-vpo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Passo 5 — Subir no GitHub
Após editar o `firebase.js`, faça upload no GitHub normalmente.
A Vercel atualiza o site automaticamente.

---

## 🚀 Rodar localmente
```bash
npm install
npm start
```

## 🔐 Senha Admin
```
ambev2025
```

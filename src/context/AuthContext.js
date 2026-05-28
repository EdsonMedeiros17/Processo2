import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const SUPER_ADMIN = 'edson.fernando0117@gmail.com';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil] = useState(null); // 'superadmin' | 'admin'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        // Determina perfil
        if (user.email === SUPER_ADMIN) {
          setPerfil('superadmin');
        } else {
          // Verifica se está cadastrado como admin
          const snap = await getDoc(doc(db, 'admins', user.uid));
          setPerfil(snap.exists() ? 'admin' : null);
        }
      } else {
        setUsuario(null);
        setPerfil(null);
      }
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  const login = (email, senha) => signInWithEmailAndPassword(auth, email, senha);

  const logout = () => signOut(auth);

  const recuperarSenha = (email) => sendPasswordResetEmail(auth, email);

  const alterarSenha = (novaSenha) => updatePassword(auth.currentUser, novaSenha);

  const cadastrarAdmin = async (email, senha, nome) => {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, 'admins', cred.user.uid), {
      email, nome, criadoEm: new Date().toISOString()
    });
    // Volta a logar como super admin (o Firebase troca o usuário ao criar conta)
    await signOut(auth);
    await signInWithEmailAndPassword(auth, SUPER_ADMIN, 'Romulano');
    return cred;
  };

  const listarAdmins = async () => {
    const snap = await getDocs(collection(db, 'admins'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  const removerAdmin = async (uid) => {
    await deleteDoc(doc(db, 'admins', uid));
  };

  const isSuperAdmin = perfil === 'superadmin';
  const isAdmin = perfil === 'admin' || perfil === 'superadmin';

  return (
    <AuthContext.Provider value={{
      usuario, perfil, carregando,
      login, logout, recuperarSenha, alterarSenha,
      cadastrarAdmin, listarAdmins, removerAdmin,
      isSuperAdmin, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

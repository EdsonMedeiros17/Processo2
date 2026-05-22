import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0IvQeMQB5Z1JV65AAXLQYEvkXC8AMDCM",
  authDomain: "quadrovpo.firebaseapp.com",
  projectId: "quadrovpo",
  storageBucket: "quadrovpo.firebasestorage.app",
  messagingSenderId: "1080079410147",
  appId: "1:1080079410147:web:fb82d665d296b8ad9d76d6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
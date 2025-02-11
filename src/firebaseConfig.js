import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwRDEWPYtBnKusMojKvTXvbxdHNHEXfHI",
  authDomain: "ecommerce-de0a8.firebaseapp.com",
  projectId: "ecommerce-de0a8",
  storageBucket: "ecommerce-de0a8.firebasestorage.app",
  messagingSenderId: "464560879878",
  appId: "1:464560879878:web:bfe6b62282aff07fdf0687"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

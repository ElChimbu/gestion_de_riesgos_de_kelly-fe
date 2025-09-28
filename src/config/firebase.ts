import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOtFNiiTQBx8Q1uG9BuY-0Rl6wXNX15Ko",
  authDomain: "misfinanzascrypto.firebaseapp.com",
  projectId: "misfinanzascrypto",
  storageBucket: "misfinanzascrypto.firebasestorage.app",
  messagingSenderId: "125737034568",
  appId: "1:125737034568:web:c5585b73dc5eb94e15497d",
  measurementId: "G-8FV6R7RX59"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de autenticación
export const auth = getAuth(app);

// Configurar proveedor de Google
export const googleProvider = new GoogleAuthProvider();

export default app; 
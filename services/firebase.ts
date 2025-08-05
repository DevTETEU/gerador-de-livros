import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As variáveis de ambiente são acessadas via `process.env` em ambientes Vercel.
// O usuário DEVE prefixar as variáveis na Vercel com 'VITE_'.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Lança um erro claro se as variáveis de ambiente não estiverem configuradas.
// Isso impede erros silenciosos e ajuda a depurar problemas de configuração.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "A configuração do Firebase está incompleta. Verifique se você configurou as variáveis de ambiente na Vercel com o prefixo 'VITE_'. Ex: VITE_FIREBASE_API_KEY."
  );
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);


// Inicializa e exporta os serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

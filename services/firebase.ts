
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Em um ambiente de build de front-end como Vite (usado pela Vercel),
// as variáveis de ambiente são acessadas via import.meta.env.
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
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

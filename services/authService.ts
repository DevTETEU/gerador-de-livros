import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

// O tipo Credentials agora é local para este módulo.
interface Credentials {
    email: string;
    password?: string;
}

export const register = async ({ email, password }: Required<Credentials>): Promise<UserCredential> => {
    if (!email || !password) {
        throw new Error("Email e senha são necessários para o registro.");
    }
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este email já está em uso por outra conta.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('A senha é muito fraca. Deve ter pelo menos 6 caracteres.');
        }
        console.error("Firebase registration error:", error);
        throw new Error('Falha ao registrar. Por favor, tente novamente.');
    }
};

export const login = async ({ email, password }: Required<Credentials>): Promise<UserCredential> => {
     if (!email || !password) {
        throw new Error("Email e senha são necessários para o login.");
    }
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('Email ou senha inválidos.');
        }
        console.error("Firebase login error:", error);
        throw new Error('Falha ao fazer login. Por favor, tente novamente.');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase logout error:", error);
        throw new Error('Falha ao fazer logout.');
    }
};

// getCurrentUser agora é tratado pelo onAuthStateChanged no App.tsx,
// tornando uma função explícita aqui desnecessária para o fluxo do app.
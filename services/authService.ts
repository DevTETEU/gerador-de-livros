import { User } from '../types';

const USERS_KEY = 'gen_books_users';
const CURRENT_USER_KEY = 'gen_books_currentUser';

// Helper to get users from localStorage
const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (credentials: User): User => {
    if (!credentials.email || !credentials.password) {
        throw new Error("Email e senha são necessários para o registro.");
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === credentials.email);
    if (existingUser) {
        throw new Error('Usuário com este email já existe.');
    }
    
    // Em uma aplicação real, a senha deve ser hasheada antes de salvar.
    users.push({ email: credentials.email, password: credentials.password });
    saveUsers(users);
    
    return login(credentials);
};

export const login = (credentials: User): User => {
    if (!credentials.email || !credentials.password) {
        throw new Error("Email e senha são necessários para o login.");
    }

    const users = getUsers();
    const foundUser = users.find(u => u.email === credentials.email);
    
    // Em uma aplicação real, você compararia a senha hasheada.
    if (!foundUser || foundUser.password !== credentials.password) {
        throw new Error('Email ou senha inválidos.');
    }
    
    // Armazena apenas o email no estado de "usuário logado" por segurança.
    const userToStore = { email: foundUser.email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    
    return userToStore;
};

export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    // Retorna um objeto User sem a senha.
    return user ? JSON.parse(user) : null;
};
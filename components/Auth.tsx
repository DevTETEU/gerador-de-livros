import React, { useState } from 'react';
import * as authService from '../services/authService';

// onLoginSuccess não é mais necessário, pois o App.tsx escuta
// as mudanças de autenticação diretamente do Firebase.
export const Auth: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError('Email e senha são obrigatórios.');
            setIsLoading(false);
            return;
        }

        try {
            const credentials = { email, password };
            if (isLoginMode) {
                await authService.login(credentials);
            } else {
                await authService.register(credentials);
            }
            // Não é necessário chamar onLoginSuccess. O listener onAuthStateChanged
            // no App.tsx cuidará da atualização do estado.
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Gerador de Livros</h1>
                        <p className="text-slate-400 mt-2">{isLoginMode ? 'Entre na sua conta para continuar' : 'Crie uma conta para começar'}</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-center" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                placeholder="voce@exemplo.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-transform transform hover:scale-105 active:scale-100 disabled:bg-indigo-900/50 disabled:cursor-not-allowed"
                        >
                             {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : (isLoginMode ? 'Entrar' : 'Criar Conta')}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                            {isLoginMode ? 'Não tem uma conta? Crie uma' : 'Já tem uma conta? Entre'}
                        </button>
                    </div>
                </div>
                 <footer className="text-center text-xs text-slate-500 mt-8">
                    Criado com Firebase, React e Gemini API.
                </footer>
            </div>
        </div>
    );
};
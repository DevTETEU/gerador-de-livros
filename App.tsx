import React, { useState, useCallback, useEffect } from 'react';
import { BookDisplay } from './components/BookDisplay';
import { ActionButtons } from './components/ActionButtons';
import { startOrContinueStream, resetChat, primeChatWithHistory } from './services/geminiService';
import * as authService from './services/authService';
import * as bookService from './services/bookService';
import { Auth } from './components/Auth';
import { Book, User } from './types';
import { UserActions } from './components/UserActions';
import { BookForm } from './components/BookForm';

type LoadingAction = 'generate' | 'continue' | 'expand' | 'dialogue' | 'organize' | 'save' | null;

const GENRES = ['Comédia', 'Ação', 'Ficção Científica', 'Fantasia', 'Romance', 'Suspense', 'Terror', 'Drama'];

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
    const [topic, setTopic] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [bookContent, setBookContent] = useState<string>('');
    const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        handleReset();
    };

    const handleStreamRequest = useCallback(async (prompt: string, action: LoadingAction, isNewStory: boolean = false) => {
        setLoadingAction(action);
        setError(null);

        const isRewrite = action === 'expand' || action === 'dialogue' || action === 'organize';

        if (action === 'generate' || isRewrite) {
            setBookContent('');
        }

        try {
            const stream = startOrContinueStream(prompt, isNewStory);
            
            for await (const chunk of stream) {
                setBookContent(prev => prev + chunk);
            }
             if (action === 'generate' || isRewrite || action === 'continue') {
                setIsGenerated(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro desconhecido ao comunicar com a IA.');
        } finally {
            setLoadingAction(null);
        }
    }, []);

    const handleGenerateBook = useCallback(() => {
        if (!topic.trim()) {
            setError('Por favor, insira um tema para o livro.');
            return;
        }
        let prompt = `Escreva um livro completo sobre o tema: "${topic}"`;
        if (genre) {
            prompt = `Escreva um livro completo no gênero de ${genre} sobre o tema: "${topic}"`;
        }
        handleStreamRequest(prompt, 'generate', true);
    }, [topic, genre, handleStreamRequest]);
    
    const handleContinue = useCallback(() => {
        const prompt = `Continue a história a partir do último capítulo, adicionando um novo capítulo que siga a lógica e o tom da narrativa.`;
        handleStreamRequest(prompt, 'continue');
    }, [handleStreamRequest]);

    const handleExpand = useCallback(() => {
        const prompt = `Reescreva o livro inteiro que você escreveu até agora, tornando as descrições mais ricas, os parágrafos mais longos e a prosa mais elaborada, sem alterar a trama principal. Mantenha o formato de TÍTULO e CAPÍTULOS.`;
        handleStreamRequest(prompt, 'expand');
    }, [handleStreamRequest]);
    
    const handleImproveDialogue = useCallback(() => {
        const prompt = `Reescreva o livro inteiro que você escreveu até agora, focando em melhorar os diálogos entre os personagens. Torne-os mais realistas, impactantes e reveladores sobre suas personalidades. Mantenha o formato, a trama e os capítulos.`;
        handleStreamRequest(prompt, 'dialogue');
    }, [handleStreamRequest]);
    
    const handleOrganize = useCallback((organizationPrompt: string) => {
        handleStreamRequest(organizationPrompt, 'organize');
    }, [handleStreamRequest]);

    const handleReset = useCallback(() => {
        setTopic('');
        setBookContent('');
        setGenre('');
        setError(null);
        setIsGenerated(false);
        setLoadingAction(null);
        resetChat();
    }, []);
    
    const extractTitle = (content: string): string => {
        const match = content.match(/^TÍTULO:\s*(.*)/im);
        return match ? match[1] : 'Livro sem título';
    };

    const handleSaveBook = async () => {
        if (!currentUser || !bookContent) return;
        setLoadingAction('save');
        try {
            const title = extractTitle(bookContent);
            await bookService.saveBook({
                id: title, // Using title as a simple ID for overwriting
                userId: currentUser.email,
                title,
                content: bookContent,
            });
            // Maybe add a success toast/notification later
        } catch (err: any) {
            setError(err.message || "Falha ao salvar o livro.");
        } finally {
            setLoadingAction(null);
        }
    };
    
    const handleLoadBook = (book: Book) => {
        try {
            handleReset();
            setBookContent(book.content);
            setTopic(book.title);
            setIsGenerated(true);
            // Prime the chat with the book content so edits are contextual
            primeChatWithHistory(book.content);
        } catch (err: any) {
            setError(err.message || 'Falha ao carregar o livro. Verifique a configuração da API Key.');
            setIsGenerated(false); // Reset state if priming fails
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        if (!currentUser) return;
        setLoadingAction('generate');
        try {
            await bookService.deleteBook(bookId, currentUser.email);
            // If the deleted book is the one currently loaded, reset the view
            if(extractTitle(bookContent) === bookId) {
                handleReset();
            }
        } catch(err: any) {
            setError(err.message || "Falha ao deletar o livro.");
        } finally {
             setLoadingAction(null);
        }
    };

    if (!currentUser) {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans flex flex-col lg:flex-row">
            <header className="lg:hidden p-4 bg-slate-950/50 backdrop-blur-sm shadow-lg sticky top-0 z-20">
                 <h1 className="text-xl font-bold text-center text-white">Gerador de Livros</h1>
            </header>
            
            <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-slate-950/30 flex flex-col space-y-8 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
                <div className="flex-grow flex flex-col justify-between">
                    <div>
                        <div className="text-center lg:text-left mb-8">
                            <h1 className="text-3xl font-bold text-white">Gerador de Livros</h1>
                            <p className="mt-2 text-slate-400">
                                {isGenerated 
                                    ? "Edite sua história ou salve-a em sua conta."
                                    : "Transforme uma ideia em uma história completa."
                                }
                            </p>
                        </div>
                        
                        <UserActions 
                            user={currentUser}
                            onLogout={handleLogout}
                            onLoadBook={handleLoadBook}
                            onDeleteBook={handleDeleteBook}
                            loading={loadingAction !== null}
                        />

                        {!isGenerated ? (
                             <BookForm 
                                topic={topic} 
                                setTopic={setTopic}
                                genre={genre}
                                setGenre={setGenre}
                                genres={GENRES}
                                onSubmit={handleGenerateBook} 
                                isLoading={loadingAction === 'generate'} 
                            />
                        ) : (
                            <ActionButtons
                                onContinue={handleContinue}
                                onExpand={handleExpand}
                                onImproveDialogue={handleImproveDialogue}
                                onOrganize={handleOrganize}
                                onReset={handleReset}
                                loadingAction={loadingAction}
                            />
                        )}
                       
                    </div>
                    <footer className="text-center text-xs text-slate-500 mt-8">
                        Criado com React, Tailwind e Gemini API.
                    </footer>
                </div>
            </aside>

            <main className="w-full lg:w-2/3 xl:w-3/4 p-6 lg:p-10 flex-grow flex flex-col">
                 {isGenerated && bookContent && (
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-white truncate pr-4">{extractTitle(bookContent)}</h2>
                        <button 
                            onClick={handleSaveBook} 
                            disabled={loadingAction !== null}
                            className="flex-shrink-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all transform hover:scale-105 active:scale-100 disabled:bg-green-900/50 disabled:cursor-not-allowed disabled:transform-none"
                            aria-label="Salvar Livro"
                        >
                            {loadingAction === 'save' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                'Salvar Livro'
                            )}
                        </button>
                    </div>
                )}
                <div className="flex-grow relative">
                    <BookDisplay 
                        content={bookContent} 
                        isLoading={loadingAction !== null} 
                        error={error} 
                        isGenerated={isGenerated}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
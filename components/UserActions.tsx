import React, { useState, useEffect } from 'react';
import { User, Book } from '../types';
import * as bookService from '../services/bookService';

interface UserActionsProps {
    user: User;
    onLogout: () => void;
    onLoadBook: (book: Book) => void;
    onDeleteBook: (bookId: string) => void;
    loading: boolean;
    forceUpdate: any; // A simple prop to trigger re-fetch
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onLogout, onLoadBook, onDeleteBook, loading, forceUpdate }) => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!user) return;
            setIsLoadingBooks(true);
            setError(null);
            try {
                const books = await bookService.getBooksForUser(user.uid);
                setSavedBooks(books);
            } catch (err: any) {
                setError(err.message || 'Falha ao carregar livros.');
            } finally {
                setIsLoadingBooks(false);
            }
        };
        fetchBooks();
    }, [user, forceUpdate, loading]); // Refetch when user changes or an external action completes

    return (
        <div className="space-y-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 mb-8">
            <div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-400">Logado como:</p>
                        <p className="font-medium text-white truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        disabled={loading}
                    >
                        Sair
                    </button>
                </div>
            </div>
            
            <div>
                <h3 className="text-md font-semibold text-white mb-3">Seus Livros Salvos</h3>
                {error && <p className="text-sm text-red-400">{error}</p>}
                {isLoadingBooks ? (
                     <p className="text-sm text-slate-400">Carregando livros...</p>
                ) : savedBooks.length > 0 ? (
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {savedBooks.map((book) => (
                            <li key={book.id} className="flex items-center justify-between bg-slate-800 p-2 rounded-md group">
                                <span className="text-slate-300 text-sm truncate pr-2">{book.title}</span>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onLoadBook(book)} title="Carregar Livro" disabled={loading} className="text-green-400 hover:text-green-300 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></button>
                                    <button onClick={() => book.id && onDeleteBook(book.id)} title="Deletar Livro" disabled={loading} className="text-red-500 hover:text-red-400 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-400 italic">Nenhum livro salvo ainda.</p>
                )}
            </div>
        </div>
    );
};
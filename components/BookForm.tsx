import React from 'react';

interface BookFormProps {
    topic: string;
    setTopic: (topic: string) => void;
    genre: string;
    setGenre: (genre: string) => void;
    genres: string[];
    onSubmit: () => void;
    isLoading: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({ topic, setTopic, genre, setGenre, genres, onSubmit, isLoading }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };
    
    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
                    Tema do Livro
                </label>
                <textarea
                    id="topic"
                    name="topic"
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Ex: Uma civilização antiga que vivia no fundo do oceano..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>
            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-slate-300 mb-2">
                    Gênero (Opcional)
                </label>
                <select
                    id="genre"
                    name="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                    <option value="">Selecione um gênero...</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-transform transform hover:scale-105 active:scale-100 disabled:bg-indigo-900/50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Escrevendo...
                    </>
                ) : (
                    'Gerar Livro'
                )}
            </button>
        </form>
    );
};
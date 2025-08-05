import React, { useMemo } from 'react';

interface BookDisplayProps {
    content: string;
    isLoading: boolean;
    error: string | null;
    isGenerated: boolean;
}

const parseBookContent = (content: string) => {
    // Split by newline but keep multiple newlines as spacers by filtering out only truly empty lines
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let key = 0;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('TÍTULO:')) {
            elements.push(<h1 key={key++} className="text-3xl lg:text-4xl font-bold font-serif text-white mb-6 text-center">{trimmedLine.replace('TÍTULO:', '').trim()}</h1>);
        } else if (trimmedLine.match(/^CAPÍTULO \d+:/)) {
            elements.push(<h2 key={key++} className="text-2xl font-bold font-serif text-indigo-400 mt-8 mb-4">{trimmedLine}</h2>);
        } else if (trimmedLine !== '') {
            elements.push(<p key={key++} className="text-slate-300 leading-relaxed my-4">{trimmedLine}</p>);
        } else {
            // Render a spacer for intentional empty lines
            elements.push(<div key={key++} style={{ height: '1em' }} />);
        }
    });
    
    // Filter out consecutive spacers
    const finalElements = elements.filter((el, index) => {
        const prevEl = elements[index - 1];
        if (el.type === 'div' && prevEl?.type === 'div') {
            return false;
        }
        return true;
    });

    return finalElements;
};


const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-white">Aguarde, a magia está acontecendo...</h3>
        <p className="text-slate-400 mt-2">Sua história está sendo aprimorada pela IA.</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-5.747H17.747M5 3v18h14V3H5zm2 2h10v14H7V5zm2 2h6v2H9V7zm0 4h6v2H9v-2zm0 4h6v2H9v-2z" />
        </svg>
        <h2 className="mt-6 text-2xl font-bold text-white">Pronto para criar uma história?</h2>
        <p className="mt-2 text-slate-400">Use o painel à esquerda para inserir um tema e clique em "Gerar Livro" para ver a IA construir um universo para você.</p>
    </div>
);


export const BookDisplay: React.FC<BookDisplayProps> = ({ content, isLoading, error, isGenerated }) => {
    const formattedContent = useMemo(() => parseBookContent(content), [content]);
    
    // Show spinner if loading, regardless of content
    if (isLoading) {
        // If content exists, show it dimmed in the background
        if (content) {
            return (
                <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-10 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg shadow-inner h-full w-full overflow-y-auto opacity-30">
                        <article className="p-6 sm:p-8 lg:p-12 font-serif text-lg">
                            {formattedContent}
                        </article>
                    </div>
                </div>
            );
        }
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative max-w-md text-center" role="alert">
                    <strong className="font-bold block">Ocorreu um Erro!</strong>
                    <span className="block sm:inline mt-2">{error}</span>
                </div>
            </div>
        );
    }
    
    if (!isGenerated && !content) {
        return <InitialState />;
    }

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-inner h-full w-full overflow-y-auto">
            <article className="p-6 sm:p-8 lg:p-12 font-serif text-lg">
                {formattedContent.length > 0 ? formattedContent : <InitialState />}
            </article>
        </div>
    );
};
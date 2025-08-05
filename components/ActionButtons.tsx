import React, { useState } from 'react';

type LoadingAction = 'generate' | 'continue' | 'expand' | 'dialogue' | 'organize' | 'save' | null;

interface ActionButtonsProps {
    onContinue: () => void;
    onExpand: () => void;
    onImproveDialogue: () => void;
    onOrganize: (prompt: string) => void;
    onReset: () => void;
    loadingAction: LoadingAction;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ActionButton: React.FC<{ action: LoadingAction, loadingAction: LoadingAction, onClick: () => void, children: React.ReactNode }> = ({ action, loadingAction, onClick, children }) => (
    <button
        type="button"
        disabled={loadingAction !== null}
        onClick={onClick}
        className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white transition-all transform hover:scale-105 active:scale-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 focus:ring-indigo-500`}
    >
        {loadingAction === action ? <><Spinner /> Processando...</> : children}
    </button>
);

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onContinue, onExpand, onImproveDialogue, onOrganize, onReset, loadingAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'reorder'>('create');
    const [createAfterChapter, setCreateAfterChapter] = useState('');
    const [createTopic, setCreateTopic] = useState('');
    const [reorderValue, setReorderValue] = useState('');

    const handleOrganizeSubmit = () => {
        let prompt = '';
        if (modalMode === 'create' && createAfterChapter && createTopic) {
            prompt = `Insira um novo capítulo após o CAPÍTULO ${createAfterChapter}. O novo capítulo deve ser sobre "${createTopic}". Reescreva o livro inteiro com esta adição, renumerando os capítulos seguintes.`;
        } else if (modalMode === 'reorder' && reorderValue) {
            prompt = `Reorganize os capítulos do livro na seguinte ordem: ${reorderValue}. Reescreva o livro inteiro nesta nova ordem.`;
        }
        
        if (prompt) {
            onOrganize(prompt);
            setIsModalOpen(false);
            // Reset modal state
            setCreateAfterChapter('');
            setCreateTopic('');
            setReorderValue('');
        }
    };

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-white text-center lg:text-left">Painel de Edição</h3>
            
            <ActionButton action="continue" loadingAction={loadingAction} onClick={onContinue}>Continuar Livro</ActionButton>
            <ActionButton action="expand" loadingAction={loadingAction} onClick={onExpand}>Aumentar Escrita</ActionButton>
            <ActionButton action="dialogue" loadingAction={loadingAction} onClick={onImproveDialogue}>Melhorar Diálogos</ActionButton>
            <ActionButton action="organize" loadingAction={loadingAction} onClick={() => setIsModalOpen(true)}>Gerenciar Capítulos</ActionButton>

            <div className="pt-4">
                 <button
                    type="button"
                    disabled={loadingAction !== null}
                    onClick={onReset}
                    className="w-full flex justify-center items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Começar de Novo
                </button>
            </div>
            
            {/* Modal for Chapter Management */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-lg border border-slate-700">
                        <h4 className="text-xl font-bold text-white mb-4">Gerenciar Capítulos</h4>
                        
                        <div className="flex bg-slate-900 rounded-lg p-1 mb-6">
                            <button onClick={() => setModalMode('create')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${modalMode === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Criar Novo Capítulo</button>
                            <button onClick={() => setModalMode('reorder')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${modalMode === 'reorder' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Reorganizar Capítulos</button>
                        </div>

                        {modalMode === 'create' ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="after-chapter" className="block text-sm font-medium text-slate-300 mb-1">Criar após qual capítulo?</label>
                                    <input id="after-chapter" type="number" value={createAfterChapter} onChange={e => setCreateAfterChapter(e.target.value)} placeholder="Ex: 2" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="new-topic" className="block text-sm font-medium text-slate-300 mb-1">Sobre o que deve ser o novo capítulo?</label>
                                    <textarea id="new-topic" value={createTopic} onChange={e => setCreateTopic(e.target.value)} rows={3} placeholder="Ex: A descoberta de um artefato misterioso..." className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="reorder" className="block text-sm font-medium text-slate-300 mb-1">Nova ordem dos capítulos</label>
                                <input id="reorder" type="text" value={reorderValue} onChange={e => setReorderValue(e.target.value)} placeholder="Ex: 1, 3, 2, 4, 5" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500" />
                                <p className="text-xs text-slate-400 mt-2">Digite os números dos capítulos na ordem desejada, separados por vírgula.</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors">Cancelar</button>
                            <button onClick={handleOrganizeSubmit} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Confirmar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
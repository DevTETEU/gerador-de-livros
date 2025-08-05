import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Não lance um erro no nível superior. Isso quebra o aplicativo no Vercel se a chave não estiver definida.
// Em vez disso, vamos lidar com a ausência da chave nas funções que a utilizam.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API_KEY do Google Gemini não encontrada. O aplicativo não funcionará até que a variável de ambiente seja configurada.");
}

let chat: Chat | null = null;

const systemInstruction = `
Você é um autor de best-sellers, mestre em criar narrativas longas, detalhadas e envolventes com reviravoltas chocantes e inesperadas.
Sua tarefa é escrever, continuar ou reescrever um livro completo baseado nas instruções do usuário.

A estrutura do livro deve ser:
1.  **Título Cativante**: Formate como "TÍTULO: [Seu Título Aqui]".
2.  **Múltiplos Capítulos**: Formate cada capítulo como "CAPÍTULO X: [Título do Capítulo]".
3.  **Desenvolvimento Profundo**: Explore os pensamentos, emoções e motivações dos personagens. Descreva os cenários com riqueza de detalhes.
4.  **Reviravoltas**: Se solicitado, introduza reviravoltas surpreendentes.
5.  **Qualidade**: A escrita deve ser de alto nível, digna de um romance publicado.

Ao reescrever ou continuar, sempre mantenha o formato e a coerência da história.
Não inclua notas de autor ou explicações sobre o que você fez, apenas retorne o texto do livro.
`;

const checkApiOrThrow = () => {
    if (!ai) {
        throw new Error("A chave de API do Google Gemini não está configurada. Por favor, adicione a variável de ambiente API_KEY nas configurações do seu projeto na Vercel.");
    }
};

const initializeChat = (): Chat => {
    checkApiOrThrow();
    // A verificação acima garante que `ai` não é nulo aqui.
    return ai!.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            // Desativa o 'thinking' para reduzir a latência e obter respostas mais rápidas.
            thinkingConfig: { thinkingBudget: 0 },
        },
    });
};

export async function* startOrContinueStream(prompt: string, startNewChat: boolean = false) {
    checkApiOrThrow();

    if (startNewChat || !chat) {
        console.log("Starting new chat session.");
        chat = initializeChat();
    }

    try {
        const streamResult = await chat.sendMessageStream({ message: prompt });
        for await (const chunk of streamResult) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error during Gemini API call:", error);
        throw new Error("Falha ao se comunicar com a API do Gemini. Verifique se a chave é válida e tem permissões.");
    }
}

export const primeChatWithHistory = (historyContent: string) => {
    checkApiOrThrow();
    console.log("Priming chat with book history.");
    chat = initializeChat();
    // Silently send the book content to the chat to provide context for future edits.
    // We don't need to process the response here.
    chat.sendMessage({ message: `CONTEXTO: O livro atual é o seguinte:\n\n${historyContent}\n\nVocê agora continuará a editar este livro com base nas minhas próximas instruções.` });
};


export const resetChat = () => {
    console.log("Resetting chat session.");
    chat = null;
};
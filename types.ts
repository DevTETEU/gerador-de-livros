export interface User {
    uid: string;
    email: string;
}

export interface Book {
    id?: string; // O ID do documento do Firestore
    userId: string; // uid do usuário do Firebase
    title: string;
    content: string;
}

export interface User {
    email: string;
    password?: string; // Senha é opcional, usada para registro/login mas não mantida no estado do app.
}

export interface Book {
    id: string;
    userId: string;
    title: string;
    content: string;
}
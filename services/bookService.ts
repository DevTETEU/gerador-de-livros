import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Book } from '../types';

const booksCollectionRef = collection(db, 'books');

export const getBooksForUser = async (userId: string): Promise<Book[]> => {
    try {
        const q = query(booksCollectionRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const books: Book[] = [];
        querySnapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() } as Book);
        });
        return books;
    } catch (error) {
        console.error("Error getting user books from Firestore:", error);
        throw new Error("Não foi possível carregar os livros salvos.");
    }
};

export const saveBook = async (bookToSave: Book): Promise<Book> => {
    try {
        if (bookToSave.id) {
            // Atualizar livro existente
            const bookDocRef = doc(db, 'books', bookToSave.id);
            const { id, ...dataToUpdate } = bookToSave; // Não salve o ID dentro do documento
            await updateDoc(bookDocRef, dataToUpdate);
            return bookToSave;
        } else {
            // Adicionar novo livro
            const { id, ...dataToAdd } = bookToSave;
            const docRef = await addDoc(booksCollectionRef, dataToAdd);
            return { id: docRef.id, ...dataToAdd };
        }
    } catch (error) {
        console.error("Error saving book to Firestore:", error);
        throw new Error("Não foi possível salvar o livro.");
    }
};

export const deleteBook = async (bookId: string): Promise<void> => {
    try {
        const bookDocRef = doc(db, 'books', bookId);
        await deleteDoc(bookDocRef);
    } catch (error) {
        console.error("Error deleting book from Firestore:", error);
        throw new Error("Não foi possível deletar o livro.");
    }
};
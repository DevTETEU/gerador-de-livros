import { Book } from '../types';

const BOOKS_KEY = 'gen_books_library';

const getBooks = (): Book[] => {
    const books = localStorage.getItem(BOOKS_KEY);
    return books ? JSON.parse(books) : [];
};

const saveAllBooks = (books: Book[]) => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const getBooksForUser = async (userId: string): Promise<Book[]> => {
    const allBooks = getBooks();
    return allBooks.filter(book => book.userId === userId);
};

export const saveBook = async (bookToSave: Book): Promise<Book> => {
    let allBooks = getBooks();
    const existingBookIndex = allBooks.findIndex(
        book => book.userId === bookToSave.userId && book.title === bookToSave.title
    );

    if (existingBookIndex !== -1) {
        // Update existing book
        allBooks[existingBookIndex] = bookToSave;
    } else {
        // Add new book
        allBooks.push(bookToSave);
    }
    
    saveAllBooks(allBooks);
    return bookToSave;
};

export const deleteBook = async (bookId: string, userId: string): Promise<void> => {
    let allBooks = getBooks();
    const filteredBooks = allBooks.filter(
        book => !(book.id === bookId && book.userId === userId)
    );
    saveAllBooks(filteredBooks);
};

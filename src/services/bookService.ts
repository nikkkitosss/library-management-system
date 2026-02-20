import { v4 as uuidv4 } from "uuid";
import { books } from "../storage";
import { Book } from "../types";
import { CreateBookInput, UpdateBookInput } from "../schemas";
import { saveAll } from "../storage/persistence";

export const bookService = {
  getAll(): Book[] {
    return Array.from(books.values());
  },

  getById(id: string): Book | undefined {
    return books.get(id);
  },

  create(data: CreateBookInput): Book {
    const existingIsbn = Array.from(books.values()).find(
      (b) => b.isbn === data.isbn,
    );
    if (existingIsbn) {
      throw new Error(`Book with ISBN "${data.isbn}" already exists`);
    }

    const book: Book = {
      id: uuidv4(),
      ...data,
      available: true,
    };
    books.set(book.id, book);
    saveAll();
    return book;
  },

  update(id: string, data: UpdateBookInput): Book | undefined {
    const book = books.get(id);
    if (!book) return undefined;

    if (data.isbn && data.isbn !== book.isbn) {
      const existingIsbn = Array.from(books.values()).find(
        (b) => b.isbn === data.isbn && b.id !== id,
      );
      if (existingIsbn) {
        throw new Error(`Book with ISBN "${data.isbn}" already exists`);
      }
    }

    const updated: Book = { ...book, ...data };
    books.set(id, updated);
    saveAll();
    return updated;
  },

  delete(id: string): boolean {
    const deleted = books.delete(id);
    if (deleted) saveAll();
    return deleted;
  },
};

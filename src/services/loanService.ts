import { v4 as uuidv4 } from "uuid";
import { loans, books, users } from "../storage";
import { Loan } from "../types";
import { CreateLoanInput } from "../schemas";
import { saveAll } from "../storage/persistence";

export const loanService = {
  getAll(): Loan[] {
    return Array.from(loans.values());
  },

  create(data: CreateLoanInput): Loan {
    const user = users.get(data.userId);
    if (!user) {
      throw new Error(`User with id "${data.userId}" not found`);
    }

    const book = books.get(data.bookId);
    if (!book) {
      throw new Error(`Book with id "${data.bookId}" not found`);
    }

    if (!book.available) {
      throw new Error(`Book "${book.title}" is not available for loan`);
    }

    const activeLoan = Array.from(loans.values()).find(
      (l) => l.bookId === data.bookId && l.status === "ACTIVE",
    );
    if (activeLoan) {
      throw new Error(`Book "${book.title}" already has an active loan`);
    }

    const loan: Loan = {
      id: uuidv4(),
      userId: data.userId,
      bookId: data.bookId,
      loanDate: new Date(),
      returnDate: null,
      status: "ACTIVE",
    };

    loans.set(loan.id, loan);

    books.set(book.id, { ...book, available: false });
    saveAll();

    return loan;
  },

  returnBook(loanId: string): Loan | undefined {
    const loan = loans.get(loanId);
    if (!loan) return undefined;

    if (loan.status === "RETURNED") {
      throw new Error("This loan has already been returned");
    }

    const updated: Loan = {
      ...loan,
      returnDate: new Date(),
      status: "RETURNED",
    };
    loans.set(loanId, updated);

    const book = books.get(loan.bookId);
    if (book) {
      books.set(book.id, { ...book, available: true });
    }
    saveAll();

    return updated;
  },
};

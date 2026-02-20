import fs from "fs";
import path from "path";
import { books, users, loans } from "./index";
import { Book, User, Loan } from "../types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export function saveAll(): void {
  ensureDataDir();
  try {
    fs.writeFileSync(
      filePath("books"),
      JSON.stringify(Array.from(books.entries()), null, 2),
    );
    fs.writeFileSync(
      filePath("users"),
      JSON.stringify(Array.from(users.entries()), null, 2),
    );
    const loansData = Array.from(loans.entries()).map(([id, loan]) => [
      id,
      {
        ...loan,
        loanDate: loan.loanDate.toISOString(),
        returnDate: loan.returnDate ? loan.returnDate.toISOString() : null,
      },
    ]);
    fs.writeFileSync(filePath("loans"), JSON.stringify(loansData, null, 2));
  } catch (err) {
    console.error("Failed to save data to files:", err);
  }
}

export function loadAll(): void {
  ensureDataDir();

  if (fs.existsSync(filePath("books"))) {
    try {
      const raw = fs.readFileSync(filePath("books"), "utf-8");
      const entries: [string, Book][] = JSON.parse(raw);
      entries.forEach(([id, book]) => books.set(id, book));
      console.log(`Loaded ${books.size} books from file`);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  }

  if (fs.existsSync(filePath("users"))) {
    try {
      const raw = fs.readFileSync(filePath("users"), "utf-8");
      const entries: [string, User][] = JSON.parse(raw);
      entries.forEach(([id, user]) => users.set(id, user));
      console.log(`Loaded ${users.size} users from file`);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  if (fs.existsSync(filePath("loans"))) {
    try {
      const raw = fs.readFileSync(filePath("loans"), "utf-8");
      const entries: [string, any][] = JSON.parse(raw);
      entries.forEach(([id, loan]) => {
        loans.set(id, {
          ...loan,
          loanDate: new Date(loan.loanDate),
          returnDate: loan.returnDate ? new Date(loan.returnDate) : null,
        } as Loan);
      });
      console.log(`Loaded ${loans.size} loans from file`);
    } catch (err) {
      console.error("Failed to load loans:", err);
    }
  }
}

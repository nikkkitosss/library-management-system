import prisma from "../db/client";
import { CreateLoanInput } from "../schemas";
import { NotFoundError, ForbiddenError, ConflictError } from "../utils/errors";

const loanInclude = {
  book: true,
  user: { select: { id: true, name: true, email: true } },
} as const;

export const loanService = {
  async getAll(userId: string, role: "USER" | "ADMIN") {
    if (role === "ADMIN") {
      return prisma.loan.findMany({ include: loanInclude });
    }
    return prisma.loan.findMany({
      where: { userId },
      include: { book: true },
    });
  },

  async create(data: CreateLoanInput, userId: string) {
    const book = await prisma.book.findUnique({ where: { id: data.bookId } });
    if (!book)
      throw new NotFoundError(`Book with id "${data.bookId}" not found`);
    if (!book.available)
      throw new ConflictError(`Book "${book.title}" is not available for loan`);

    const activeLoan = await prisma.loan.findFirst({
      where: { bookId: data.bookId, status: "ACTIVE" },
    });
    if (activeLoan)
      throw new Error(`Book "${book.title}" already has an active loan`);

    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: { userId, bookId: data.bookId, status: "ACTIVE" },
        include: { book: true },
      }),
      prisma.book.update({
        where: { id: data.bookId },
        data: { available: false },
      }),
    ]);

    return loan;
  },

  async returnBook(loanId: string, userId: string, role: "USER" | "ADMIN") {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return null;

    if (role === "USER" && loan.userId !== userId) {
      throw new ForbiddenError("You can only return your own loans");
    }

    if (loan.status === "RETURNED") {
      throw new ConflictError("This loan has already been returned");
    }

    const [updated] = await prisma.$transaction([
      prisma.loan.update({
        where: { id: loanId },
        data: { returnDate: new Date(), status: "RETURNED" },
        include: { book: true },
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { available: true },
      }),
    ]);

    return updated;
  },
};

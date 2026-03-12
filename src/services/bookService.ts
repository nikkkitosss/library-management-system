import prisma from "../db/client";
import { CreateBookInput, UpdateBookInput } from "../schemas";
import { ConflictError } from "../utils/errors";

async function checkIsbnConflict(
  isbn: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.book.findUnique({ where: { isbn } });
  if (existing && existing.id !== excludeId) {
    throw new ConflictError(`Book with ISBN "${isbn}" already exists`);
  }
}

export const bookService = {
  async getAll() {
    return prisma.book.findMany();
  },

  async getById(id: string) {
    return prisma.book.findUnique({ where: { id } });
  },

  async create(data: CreateBookInput) {
    await checkIsbnConflict(data.isbn);
    return prisma.book.create({ data: { ...data, available: true } });
  },

  async update(id: string, data: UpdateBookInput) {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return null;

    if (data.isbn && data.isbn !== book.isbn) {
      await checkIsbnConflict(data.isbn, id);
    }

    return prisma.book.update({ where: { id }, data });
  },

  async delete(id: string) {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return false;
    await prisma.book.delete({ where: { id } });
    return true;
  },
};

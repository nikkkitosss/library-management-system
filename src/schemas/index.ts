import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z
    .number()
    .int()
    .min(1000, "Year must be a valid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  isbn: z.string().min(10).optional(),
  available: z.boolean().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

export const createLoanSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  bookId: z.string().min(1, "bookId is required"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateLoanInput = z.infer<typeof createLoanSchema>;

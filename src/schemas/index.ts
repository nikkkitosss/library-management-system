import { z } from "zod";

const emailField = z.string().email("Invalid email");
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters");
const nameField = z.string().min(1, "Name is required");
const uuidField = z.string().uuid();

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: nameField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const requestPasswordResetSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordField,
});

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number().int().min(1, "Year must be positive"),
  isbn: z.string().min(1, "ISBN is required"),
});

export const updateBookSchema = createBookSchema.partial().extend({
  available: z.boolean().optional(),
});

export const createLoanSchema = z.object({
  bookId: uuidField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateLoanInput = z.infer<typeof createLoanSchema>;

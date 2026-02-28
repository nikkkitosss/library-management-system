import { Request, Response } from "express";
import { bookService } from "../services/bookService";
import { CreateBookInput, UpdateBookInput } from "../schemas";

export const bookController = {
  getAll(req: Request, res: Response): void {
    const allBooks = bookService.getAll();
    res.json(allBooks);
  },

  getById(req: Request, res: Response): void {
    const book = bookService.getById(req.params["id"] as string);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  },

  create(req: Request, res: Response): void {
    try {
      const book = bookService.create(req.body as CreateBookInput);
      res.status(201).json(book);
    } catch (err: any) {
      res.status(409).json({ error: err.message });
    }
  },

  update(req: Request, res: Response): void {
    try {
      const book = bookService.update(
        req.params["id"] as string,
        req.body as UpdateBookInput,
      );
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      res.json(book);
    } catch (err: any) {
      res.status(409).json({ error: err.message });
    }
  },

  delete(req: Request, res: Response): void {
    const deleted = bookService.delete(req.params["id"] as string);
    if (!deleted) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(204).send();
  },
};

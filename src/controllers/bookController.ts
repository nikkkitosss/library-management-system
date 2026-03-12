import { bookService } from "../services/bookService";
import { CreateBookInput, UpdateBookInput } from "../schemas";
import { handleAsync } from "../utils/handleAsync";
import { NotFoundError } from "../utils/errors";

export const bookController = {
  getAll: handleAsync(async (_req, res) => {
    res.json(await bookService.getAll());
  }),

  getById: handleAsync(async (req, res) => {
    const book = await bookService.getById(req.params["id"]);
    if (!book) throw new NotFoundError("Book not found");
    res.json(book);
  }),

  create: handleAsync(async (req, res) => {
    res.status(201).json(await bookService.create(req.body as CreateBookInput));
  }),

  update: handleAsync(async (req, res) => {
    const book = await bookService.update(
      req.params["id"],
      req.body as UpdateBookInput,
    );
    if (!book) throw new NotFoundError("Book not found");
    res.json(book);
  }),

  delete: handleAsync(async (req, res) => {
    const deleted = await bookService.delete(req.params["id"]);
    if (!deleted) throw new NotFoundError("Book not found");
    res.status(204).send();
  }),
};

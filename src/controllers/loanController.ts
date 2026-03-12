import { loanService } from "../services/loanService";
import { CreateLoanInput } from "../schemas";
import { handleAsync } from "../utils/handleAsync";
import { NotFoundError } from "../utils/errors";

export const loanController = {
  getAll: handleAsync(async (req, res) => {
    res.json(await loanService.getAll(req.user!.userId, req.user!.role));
  }),

  create: handleAsync(async (req, res) => {
    const loan = await loanService.create(
      req.body as CreateLoanInput,
      req.user!.userId,
    );
    res.status(201).json(loan);
  }),

  returnBook: handleAsync(async (req, res) => {
    const loan = await loanService.returnBook(
      req.params["id"],
      req.user!.userId,
      req.user!.role,
    );
    if (!loan) throw new NotFoundError("Loan not found");
    res.json(loan);
  }),
};

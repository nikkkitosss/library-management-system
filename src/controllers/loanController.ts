import { Request, Response } from "express";
import { loanService } from "../services/loanService";
import { createLoanSchema } from "../schemas";

export const loanController = {
  getAll(req: Request, res: Response): void {
    res.json(loanService.getAll());
  },

  create(req: Request, res: Response): void {
    const result = createLoanSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation error", details: result.error.issues });
      return;
    }

    try {
      const loan = loanService.create(result.data);
      res.status(201).json(loan);
    } catch (err: any) {
      res.status(422).json({ error: err.message });
    }
  },

  returnBook(req: Request, res: Response): void {
    try {
      const loan = loanService.returnBook(req.params["id"] as string);
      if (!loan) {
        res.status(404).json({ error: "Loan not found" });
        return;
      }
      res.json(loan);
    } catch (err: any) {
      res.status(422).json({ error: err.message });
    }
  },
};

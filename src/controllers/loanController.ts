import { Request, Response } from "express";
import { loanService } from "../services/loanService";
import { CreateLoanInput } from "../schemas";

export const loanController = {
  getAll(req: Request, res: Response): void {
    res.json(loanService.getAll());
  },

  create(req: Request, res: Response): void {
    try {
      const loan = loanService.create(req.body as CreateLoanInput);
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

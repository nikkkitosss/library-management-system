import { Router } from "express";
import { loanController } from "../controllers/loanController";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth.middleware";
import { createLoanSchema } from "../schemas";

const router = Router();

router.get("/", authenticate, loanController.getAll);
router.post(
  "/",
  authenticate,
  validate(createLoanSchema),
  loanController.create,
);
router.post("/:id/return", authenticate, loanController.returnBook);

export default router;

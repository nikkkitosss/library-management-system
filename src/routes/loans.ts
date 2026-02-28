import { Router } from "express";
import { loanController } from "../controllers/loanController";
import { validate } from "../middleware/validate";
import { createLoanSchema } from "../schemas";

const router = Router();

router.get("/", loanController.getAll);
router.post("/", validate(createLoanSchema), loanController.create);
router.post("/:id/return", loanController.returnBook);

export default router;

import { Router } from "express";
import { loanController } from "../controllers/loanController";

const router = Router();

router.get("/", loanController.getAll);
router.post("/", loanController.create);
router.post("/:id/return", loanController.returnBook);

export default router;

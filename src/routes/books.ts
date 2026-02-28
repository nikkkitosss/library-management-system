import { Router } from "express";
import { bookController } from "../controllers/bookController";
import { validate } from "../middleware/validate";
import { createBookSchema, updateBookSchema } from "../schemas";

const router = Router();

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/", validate(createBookSchema), bookController.create);
router.put("/:id", validate(updateBookSchema), bookController.update);
router.delete("/:id", bookController.delete);

export default router;

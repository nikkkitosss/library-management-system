import { Router } from "express";
import { userController } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../schemas";

const router = Router();

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", validate(createUserSchema), userController.create);

export default router;

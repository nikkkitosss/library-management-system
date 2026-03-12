import { Router } from "express";
import { bookController } from "../controllers/bookController";
import { validate } from "../middleware/validate";
import { authenticate, checkPermissions } from "../middleware/auth.middleware";
import { createBookSchema, updateBookSchema } from "../schemas";

const router = Router();

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post(
  "/",
  ...checkPermissions("ADMIN"),
  validate(createBookSchema),
  bookController.create,
);
router.put(
  "/:id",
  ...checkPermissions("ADMIN"),
  validate(updateBookSchema),
  bookController.update,
);
router.delete("/:id", ...checkPermissions("ADMIN"), bookController.delete);

export default router;

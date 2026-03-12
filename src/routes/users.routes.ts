import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticate, checkPermissions } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, userController.getMe);
router.get("/", ...checkPermissions("ADMIN"), userController.getAll);
router.get("/:id", ...checkPermissions("ADMIN"), userController.getById);

export default router;

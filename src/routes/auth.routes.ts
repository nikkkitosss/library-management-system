import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../schemas";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);

export default router;

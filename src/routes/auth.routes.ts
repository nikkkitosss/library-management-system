import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth.middleware";
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schemas";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/request-password-reset",
  validate(requestPasswordResetSchema),
  authController.requestPasswordReset,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);

export default router;

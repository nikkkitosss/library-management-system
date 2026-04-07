import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticate, checkPermissions } from "../middleware/auth.middleware";
import { avatarUpload } from "../middleware/upload.middleware";

const router = Router();

router.get("/me", authenticate, userController.getMe);
router.post(
  "/me/avatar",
  authenticate,
  avatarUpload,
  userController.uploadAvatar,
);
router.delete("/me/avatar", authenticate, userController.deleteAvatar);
router.get("/", ...checkPermissions("ADMIN"), userController.getAll);
router.get("/:id", ...checkPermissions("ADMIN"), userController.getById);

export default router;

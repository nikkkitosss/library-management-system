import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./books.routes";
import loanRoutes from "./loans.routes";
import userRoutes from "./users.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);
router.use("/loans", loanRoutes);

export default router;

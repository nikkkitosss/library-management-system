import express from "express";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/books.routes";
import userRoutes from "./routes/users.routes";
import loanRoutes from "./routes/loans.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/loans", loanRoutes);

app.use(errorHandler);

export default app;

import express, { Request, Response, NextFunction } from "express";
import bookRoutes from "./routes/books";
import userRoutes from "./routes/users";
import loanRoutes from "./routes/loans";

const app = express();

app.use(express.json());

// Routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/loans", loanRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;

import express from "express";
import fs from "node:fs";
import path from "node:path";
import routes from "./routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const uploadsDir = path.resolve(process.cwd(), "uploads");

fs.mkdirSync(path.resolve(uploadsDir, "avatars"), { recursive: true });

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);
app.use(routes);

app.use(notFound);

app.use(errorHandler);

export default app;

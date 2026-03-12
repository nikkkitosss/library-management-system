import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/errors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
    return;
  }
  if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }
  if (err instanceof ConflictError) {
    res.status(409).json({ error: err.message });
    return;
  }

  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: "Internal server error" });
}

import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: missing token" });
    return;
  }
  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized: invalid or expired token" });
  }
}

export function checkPermissions(
  ...roles: Array<"USER" | "ADMIN">
): RequestHandler[] {
  return [
    authenticate,
    (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: "Forbidden: insufficient permissions" });
        return;
      }
      next();
    },
  ];
}

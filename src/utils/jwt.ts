import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "15m",
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as any) || "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

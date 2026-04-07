import jwt from "jsonwebtoken";
import CONFIG from "../config";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface PasswordResetJwtPayload {
  email: string;
  purpose: "password-reset";
}

function getSecret(): string {
  const secret = CONFIG.jwtSecret;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: CONFIG.jwtExpiresIn as any,
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: CONFIG.jwtRefreshExpiresIn as any,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

export function signPasswordResetToken(email: string): string {
  return jwt.sign(
    { email, purpose: "password-reset" } satisfies PasswordResetJwtPayload,
    getSecret(),
    {
      expiresIn: "15m",
    },
  );
}

export function verifyPasswordResetToken(
  token: string,
): PasswordResetJwtPayload {
  const payload = jwt.verify(token, getSecret()) as PasswordResetJwtPayload;
  if (payload.purpose !== "password-reset") {
    throw new Error("Invalid password reset token");
  }
  return payload;
}

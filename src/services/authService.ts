import bcrypt from "bcryptjs";
import prisma from "../db/client";
import { RegisterInput, LoginInput } from "../schemas";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/errors";

function buildTokenPayload(user: { id: string; email: string; role: string }) {
  return {
    userId: user.id,
    email: user.email,
    role: user.role as "USER" | "ADMIN",
  };
}

async function issueTokens(user: { id: string; email: string; role: string }) {
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing)
      throw new ConflictError("User with this email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: "USER" },
      select: { id: true, name: true, email: true, role: true },
    });
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    const { accessToken, refreshToken } = await issueTokens(user);

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async refresh(token: string) {
    let payload: ReturnType<typeof verifyToken>;
    try {
      payload = verifyToken(token);
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedError("Refresh token revoked or not found");
    }

    const { accessToken, refreshToken } = await issueTokens(user);
    return { token: accessToken, refreshToken };
  },

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};

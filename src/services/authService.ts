import bcrypt from "bcryptjs";
import prisma from "../db/client";
import {
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "../schemas";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "../utils/jwt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { sendMail } from "../utils/sendMail";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
} as const;

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
      select: publicUserSelect,
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
        avatarUrl: user.avatarUrl,
      },
    };
  },

  async requestPasswordReset(data: RequestPasswordResetInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundError("User with this email was not found");
    }

    const token = signPasswordResetToken(user.email);

    await sendMail({
      to: user.email,
      subject: "Library Management System password reset",
      text: `Use this token to reset your password within 15 minutes:\n\n${token}`,
      html: `<p>Use this token to reset your password within 15 minutes:</p><pre>${token}</pre>`,
    });

    return {
      message: "Password reset email has been sent.",
    };
  },

  async resetPassword(data: ResetPasswordInput) {
    let payload: { email: string; purpose: "password-reset" };

    try {
      payload = verifyPasswordResetToken(data.token);
    } catch {
      throw new BadRequestError("Invalid or expired reset token");
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new BadRequestError("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: "Password has been reset successfully." };
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

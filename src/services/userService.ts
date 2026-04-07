import prisma from "../db/client";
import { NotFoundError } from "../utils/errors";
import { removeAvatarFile } from "../utils/avatarFiles";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
} as const;

export const userService = {
  async getAll() {
    return prisma.user.findMany({ select: publicUserSelect });
  },

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
  },

  async updateAvatar(userId: string, avatarUrl: string) {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    if (currentUser.avatarUrl) {
      await removeAvatarFile(currentUser.avatarUrl);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: publicUserSelect,
    });
  },

  async deleteAvatar(userId: string) {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    if (!currentUser.avatarUrl) {
      throw new NotFoundError("Avatar not found");
    }

    await removeAvatarFile(currentUser.avatarUrl);

    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: publicUserSelect,
    });
  },
};

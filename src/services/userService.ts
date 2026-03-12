import prisma from "../db/client";

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export const userService = {
  async getAll() {
    return prisma.user.findMany({ select: safeSelect });
  },

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: safeSelect });
  },
};

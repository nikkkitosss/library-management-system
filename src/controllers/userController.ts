import { userService } from "../services/userService";
import { handleAsync } from "../utils/handleAsync";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { removeAvatarFile, saveAvatarImage } from "../utils/avatarFiles";

export const userController = {
  getAll: handleAsync(async (_req, res) => {
    res.json(await userService.getAll());
  }),

  getById: handleAsync(async (req, res) => {
    const user = await userService.getById(req.params["id"]);
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
  }),

  getMe: handleAsync(async (req, res) => {
    const user = await userService.getById(req.user!.userId);
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
  }),

  uploadAvatar: handleAsync(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("Avatar file is required");
    }

    const avatarUrl = await saveAvatarImage(req.file);

    try {
      const user = await userService.updateAvatar(req.user!.userId, avatarUrl);

      res.json({
        message: "Avatar updated successfully.",
        avatarUrl: user.avatarUrl,
      });
    } catch (error) {
      await removeAvatarFile(avatarUrl).catch(() => undefined);
      throw error;
    }
  }),

  deleteAvatar: handleAsync(async (req, res) => {
    await userService.deleteAvatar(req.user!.userId);
    res.json({ message: "Avatar deleted successfully." });
  }),
};

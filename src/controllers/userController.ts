import { userService } from "../services/userService";
import { handleAsync } from "../utils/handleAsync";
import { NotFoundError } from "../utils/errors";

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
};

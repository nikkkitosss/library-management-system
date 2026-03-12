import { Request, Response } from "express";
import { authService } from "../services/authService";
import { RegisterInput, LoginInput } from "../schemas";
import { handleAsync } from "../utils/handleAsync";

export const authController = {
  register: handleAsync(async (req, res) => {
    const user = await authService.register(req.body as RegisterInput);
    res.status(201).json(user);
  }),

  login: handleAsync(async (req, res) => {
    const result = await authService.login(req.body as LoginInput);
    res.json(result);
  }),

  refresh: handleAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      res.status(400).json({ error: "refreshToken is required" });
      return;
    }
    res.json(await authService.refresh(refreshToken));
  }),

  logout: handleAsync(async (req, res) => {
    await authService.logout(req.user!.userId);
    res.status(204).send();
  }),
};

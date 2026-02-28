import { Request, Response } from "express";
import { userService } from "../services/userService";
import { CreateUserInput } from "../schemas";

export const userController = {
  getAll(req: Request, res: Response): void {
    res.json(userService.getAll());
  },

  getById(req: Request, res: Response): void {
    const user = userService.getById(req.params["id"] as string);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  },

  create(req: Request, res: Response): void {
    try {
      const user = userService.create(req.body as CreateUserInput);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(409).json({ error: err.message });
    }
  },
};

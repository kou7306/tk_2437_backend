import { Request, Response } from "express";
import { getUserService, registerUserService } from "../services/userService";

export const getUserController = async (req: Request, res: Response) => {
  const { uuid } = req.query as { uuid: string };
  try {
    const users = await getUserService(uuid);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerUserController = async (req: Request, res: Response) => {
  const { id } = req.body as { id: string };
  try {
    const bool = await registerUserService(id);
    res.status(200).json(bool);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
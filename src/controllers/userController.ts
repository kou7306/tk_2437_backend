import { Request, Response } from "express";
import {
  getUserService,
  registerUserService,
  registerMbtiService,
  updateUserService,
} from "../services/userService";
import { User } from "../types/User";

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

export const registerMbtiController = async (req: Request, res: Response) => {
  const { id, mbti } = req.body as { id: string; mbti: (boolean | string[])[][] };
  try {
    const result = await registerMbtiService(id, mbti);
    res.status(200).json({ success: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { id } = req.body as { id: string };
  try {
    const bool = await registerUserService(id);
    res.status(200).json(bool);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  // リクエストボディを User 型で型定義
  const userData: User = req.body;

  try {
    const updatedUser = await updateUserService(userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

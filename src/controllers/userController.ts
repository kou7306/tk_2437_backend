import { Request, Response } from "express";
import { getUserService } from "../services/userService";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  if (!id) {
    return res.status(400).json({ error: "UUID is required" });
  }
  try {
    const user = await getUserService(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

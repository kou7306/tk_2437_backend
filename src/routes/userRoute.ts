import { Router } from "express";
import {
  getUserController,
  registerUserController,
} from "../controllers/userController";

const router = Router();

router.get("/get-user", getUserController);
router.post("register", registerUserController);

export default router;

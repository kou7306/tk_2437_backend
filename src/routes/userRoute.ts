import { Router } from "express";
import {
  getUserController,
  registerUserController,
  registerMbtiController,
  createUserController,
} from "../controllers/userController";

const router = Router();

router.get("/get-user", getUserController);
router.post("/register", registerUserController);
router.post("/register-mbti", registerMbtiController);
router.post("/create-user", createUserController);

export default router;

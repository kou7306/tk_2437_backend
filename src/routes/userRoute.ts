import { Router } from "express";
import {
  getUserController,
  registerUserController,
  registerMbtiController,
} from "../controllers/userController";

const router = Router();

router.get("/get-user", getUserController);
router.post("/register", registerUserController);
router.post("/register-mbti", registerMbtiController);

export default router;

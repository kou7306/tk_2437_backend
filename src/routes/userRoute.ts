import { Router } from "express";
import {
  getUserController,
  registerUserController,
  registerMbtiController,
  createUserController,
  updateUserController,
} from "../controllers/userController";

const router = Router();

router.get("/get-user", getUserController);
router.post("/register", registerUserController);
router.post("/register-mbti", registerMbtiController);
router.post("/create-user", createUserController);
router.post("/update-user", updateUserController);

export default router;

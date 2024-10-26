import { Router } from "express";
import { getUserController } from "../controllers/userController";

const router = Router();

router.get("/get-user", getUserController);

export default router;

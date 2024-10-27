import { Router } from "express";
import {
  getRecruitmentController,
  getFilteredRecruitmentController,
  createRecruitmentController,
} from "../controllers/recruitmentController";

const router = Router();

router.get("/get-recruitment", getRecruitmentController);
router.get("/get-filtered-recruitment", getFilteredRecruitmentController);
router.post("/create-recruitment", createRecruitmentController);

export default router;

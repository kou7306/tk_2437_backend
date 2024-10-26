import { Router } from "express";
import {
  getRecruitmentController,
  getFilteredRecruitmentController,
  createRecruitmentController,
  joinRecruitmentController,
} from "../controllers/recruitmentController";

const router = Router();

router.get("/get-recruitment", getRecruitmentController);
router.get("/get-filtered-recruitment", getFilteredRecruitmentController);
router.post("/create-recruitment", createRecruitmentController);
router.post("/join", joinRecruitmentController);

export default router;

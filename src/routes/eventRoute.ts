import e, { Router } from "express";
import {
  getEventController,
  getFilteredEventController,
  createEventController,
  suggestEventController,
  getRecruitmentWithEventController,
} from "../controllers/eventController";

const router = Router();

router.get("/get-event", getEventController);
router.get("/get-filtered-event", getFilteredEventController);
router.post("/create-event", createEventController);
router.get("/suggest-event", suggestEventController);
router.get("/get-recruitment", getEventController);
router.get("/get-recruitment-with-event", getRecruitmentWithEventController);

export default router;

import e, { Router } from "express";
import {
  getEventController,
  getFilteredEventController,
  createEventController,
  suggestEventController,
} from "../controllers/eventController";

const router = Router();

router.get("/get-event", getEventController);
router.get("/get-filtered-event", getFilteredEventController);
router.post("/create-event", createEventController);
router.get("/suggest-event", suggestEventController);

export default router;

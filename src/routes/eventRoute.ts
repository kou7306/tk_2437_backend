import e, { Router } from "express";
import {
  getEventController,
  getFilteredEventController,
  createEventController,
} from "../controllers/eventController";

const router = Router();

router.get("/get-event", getEventController);
router.get("/get-filtered-event", getFilteredEventController);
router.post("/create-event", createEventController);

export default router;

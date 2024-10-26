import { Request, Response } from "express";
import {
  getEventService,
  getFilteredEventsService,
  createEventService,
} from "../services/eventService";
import { Event } from "../types/Event";

export const getEventController = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  try {
    const users = await getEventService(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFilteredEventController = async (
  req: Request,
  res: Response
) => {
  // クエリパラメータからフィルター情報を取得
  const { sortOrder, limit, place, date } = req.query as {
    sortOrder?: "newest" | "oldest";
    limit?: string;
    place?: string;
    date?: string;
  };

  try {
    const filter = {
      sortOrder,
      limit: limit ? parseInt(limit) : undefined,
      place,
      date,
    };

    // サービスからフィルターされたイベントを取得
    const events = await getFilteredEventsService(filter);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createEventController = async (req: Request, res: Response) => {
  const eventData = req.body as Event;

  try {
    // サービスを使って新しいイベントを作成
    const newEvent = await createEventService(eventData);

    console.log(newEvent);
    res.status(200).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

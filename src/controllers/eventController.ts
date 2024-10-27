import { Request, Response } from "express";
import {
  getEventService,
  getFilteredEventsService,
  createEventService,
  getEventsWithRecruitments,
  suggestEventService,
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
  const { sortOrder, limit, place, date, tags } = req.query as {
    sortOrder?: "newest" | "oldest";
    limit?: string;
    place?: string;
    date?: string;
    tags?: string | string[];
  };

  try {
    // tagsが文字列である場合、JSON.parseで配列に変換
    const parsedTags = Array.isArray(tags)
      ? tags
      : tags
      ? JSON.parse(tags)
      : undefined;

    const filter = {
      sortOrder,
      limit: limit ? parseInt(limit) : undefined,
      place,
      date,
      tags: parsedTags, // 変換されたtagsを使用
    };

    // サービスからフィルターされたイベントを取得
    const events = await getFilteredEventsService(filter);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching filtered events:", error);
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

export const suggestEventController = async (req: Request, res: Response) => {
  const { uuid } = req.query as { uuid: string };
  try {
    const events = await suggestEventService(uuid);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecruitmentWithEventController = async (
  req: Request,
  res: Response
) => {
  // クエリから ids を取得し、配列としてパース
  const idsParam = req.query.ids as string;
  const ids = idsParam
    .replace(/[\[\]\s]/g, "") // `[`と`]`とスペースを削除
    .split(","); // カンマで分割

  try {
    const recruitments = await getEventsWithRecruitments(ids);
    res.status(200).json(recruitments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

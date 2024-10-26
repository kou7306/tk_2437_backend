import prisma from "../config/prisma";
import { Event } from "../types/Event";

export const getEventService = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    return event || null;
  } catch (error) {
    console.error("Error fetching event data:", error);
    throw new Error("イベント情報の取得に失敗しました");
  }
};

export const getFilteredEventsService = async (filter: {
  sortOrder?: "newest" | "oldest";
  limit?: number;
  place?: string;
  date?: string;
}) => {
  try {
    const queryOptions = {
      where: {
        ...(filter.place && { place: filter.place }),
        ...(filter.date && {
          period: {
            path: "$.start",
            gte: new Date(filter.date),
            lte: new Date(filter.date),
          },
        }),
      },
      orderBy: {
        created_at:
          filter.sortOrder === "newest" ? ("desc" as const) : ("asc" as const),
      },
      take: filter.limit || 10,
    };

    const events = await prisma.event.findMany(queryOptions);
    return events;
  } catch (error) {
    console.error("Failed to fetch filtered events:", error);
    throw new Error("フィルター付きイベントの取得に失敗しました");
  }
};

export const createEventService = async (eventData: Event) => {
  try {
    const newEvent = await prisma.event.create({
      data: {
        name: eventData.name,
        detail: eventData.detail,
        place: eventData.place,
        period: eventData.period,
        tags: eventData.tags,
        url: eventData.url,
      },
    });
    return newEvent;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error("イベントの作成に失敗しました");
  }
};

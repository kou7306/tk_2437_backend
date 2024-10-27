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

const mbtiTags = {
  E: ["outgoing", "social", "talkative"],
  I: ["introverted", "reserved", "quiet"],
  S: ["sensing", "practical", "realistic"],
  N: ["intuitive", "imaginative", "abstract"],
  T: ["thinking", "logical", "analytical"],
  F: ["feeling", "empathetic", "compassionate"],
  J: ["judging", "organized", "planned"],
  P: ["perceiving", "spontaneous", "flexible"],
};

const determineMbti = (tags: string[]): string => {
  const counts = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  tags.forEach(tag => {
    Object.keys(mbtiTags).forEach(key => {
      if (mbtiTags[key as keyof typeof mbtiTags].includes(tag)) {
        counts[key as keyof typeof counts]++;
      }
    });
  });

  const mbti = [
    counts.E >= counts.I ? "E" : "I",
    counts.S >= counts.N ? "S" : "N",
    counts.T >= counts.F ? "T" : "F",
    counts.J >= counts.P ? "J" : "P",
  ].join("");

  return mbti;
};

export const createEventService = async (eventData: Event) => {
  // ここでタグを元にMBTIを振り分けるロジックを描く
  const mbti = determineMbti(eventData.tags ?? []);
  try {
    const newEvent = await prisma.event.create({
      data: {
        name: eventData.name,
        detail: eventData.detail,
        place: eventData.place,
        period: eventData.period,
        tags: eventData.tags,
        url: eventData.url,
        mbti,
      },
    });
    return newEvent;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error("イベントの作成に失敗しました");
  }
};

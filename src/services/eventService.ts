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
  tags?: string[];
}) => {
  console.log(filter.tags);
  try {
    const queryOptions = {
      where: {
        ...(filter.place && { place: filter.place }), // 引用符を外す
        ...(filter.date && {
          period: {
            path: "$.start",
            gte: new Date(filter.date),
            lte: new Date(filter.date),
          },
        }),
        ...(filter.tags &&
          filter.tags.length > 0 && {
            tags: {
              hasSome: filter.tags, // tagsフィルターは配列をそのまま使用
            },
          }),
      },
      orderBy: {
        created_at:
          filter.sortOrder === "newest" ? ("desc" as const) : ("asc" as const),
      },
      take: filter.limit || 10,
    };

    const similarEvents = await prisma.event.findMany(queryOptions);
    console.log(similarEvents);
    return similarEvents;
  } catch (error) {
    console.error("Failed to fetch filtered similar events:", error);
    throw new Error("フィルター付き類似イベントの取得に失敗しました");
  }
};

export const createEventService = async (eventData: Event) => {
  // ここでタグを元にMBTIを振り分けるロジックを描く
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

export const getEventsWithRecruitments = async (
  ids: string[]
): Promise<any[]> => {
  try {
    // 指定されたIDでイベントを取得
    const events = await prisma.event.findMany({
      where: { id: { in: ids } },
    });

    // リクルートメントのIDを収集
    const recruitmentIds = events.flatMap((event) => event.recruitments); // recruitmentIdsに変更

    // リクルートメントデータを取得
    const recruitments = await prisma.recruitment.findMany({
      where: { id: { in: recruitmentIds } },
    });

    // イベントとリクルートメントを合体させる
    return events.map((event) => {
      // JSON 型の period をオブジェクトに変換
      const period =
        typeof event.period === "string"
          ? JSON.parse(event.period)
          : event.period;

      return {
        id: event.id,
        name: event.name,
        detail: event.detail,
        place: event.place,
        period: {
          start: period?.start,
          end: period?.end,
        },
        tags: event.tags,
        url: event.url,
        mbti: event.mbti,
        company: event.company,
        recruitments: recruitments
          .filter((recruitment) => event.recruitments.includes(recruitment.id)) // event.recruitmentsを利用
          .map((recruitment) => ({
            id: recruitment.id,
            title: recruitment.title,
            detail: recruitment.detail,
            participants: recruitment.participants,
            tags: recruitment.tags,
            sum: recruitment.sum,
            event_url: event.url, // イベントのURLを含める
          })),
      };
    });
  } catch (error) {
    console.error("Error fetching event data:", error);
    throw new Error("イベント情報の取得に失敗しました");
  }
};

export const suggestEventService = async (user_id: string) => {
  // ユーザーのMBTIと同じMBTIをもつイベントを提案する
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const events = await prisma.event.findMany({
      where: {
        mbti: user.mbti,
      },
    });

    return events;
  } catch (error) {
    console.error("Error suggesting events:", error);
    throw new Error("イベントの提案に失敗しました");
  }
};

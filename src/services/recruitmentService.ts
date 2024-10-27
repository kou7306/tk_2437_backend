import prisma from "../config/prisma";
import { Recruitment } from "../types/Recruitment";

export const getRecruitmentService = async (id: string) => {
  try {
    const recruitment = await prisma.recruitment.findUnique({
      where: { id },
    });
    return recruitment || null;
  } catch (error) {
    console.error("Error fetching event data:", error);
    throw new Error("イベント情報の取得に失敗しました");
  }
};

export const getFilteredRecruitmentsService = async (filter: {
  sortOrder?: "newest" | "oldest";
  limit?: number;
  place?: string;
  date?: string;
}) => {
  try {
    const queryOptions: any = {
      where: {},
      orderBy: {},
      take: filter.limit || 10,
    };

    // Sort order
    if (filter.sortOrder === "newest") {
      queryOptions.orderBy.created_at = "desc";
    } else if (filter.sortOrder === "oldest") {
      queryOptions.orderBy.created_at = "asc";
    }

    // Place filter
    if (filter.place) {
      queryOptions.where.place = filter.place;
    }

    // Date filter
    if (filter.date) {
      queryOptions.where.date = new Date(filter.date);
    }

    const recruitments = await prisma.recruitment.findMany(queryOptions);

    // BigIntを数値に変換
    const formattedRecruitments = recruitments.map((recruitment) => ({
      ...recruitment,
      sum: recruitment.sum ? Number(recruitment.sum) : undefined, // sumをNumberに変換
    }));

    return formattedRecruitments;
  } catch (error) {
    console.error("Error in recruitment service:", error);
    throw new Error("フィルター付きリクルート情報の取得に失敗しました");
  }
};

export const createRecruitmentService = async (
  recruitmentData: Recruitment
) => {
  try {
    const newRecruitment = await prisma.recruitment.create({
      data: {
        title: recruitmentData.title,
        detail: recruitmentData.detail,
        name: recruitmentData.name,
        date: recruitmentData.date ? new Date(recruitmentData.date) : null, // 日付があれば変換
        sum: recruitmentData.sum ? String(recruitmentData.sum) : "0", // sumがundefinedの場合は"0"をデフォルトに
        participants: recruitmentData.participants || [], // participantsがundefinedの場合は空配列
        tags: recruitmentData.tags || [], // tagsがundefinedの場合は空配列
        owner_id: recruitmentData.owner_id, // オーナーID
        event_url: recruitmentData.event_url, // イベントURL
      },
    });
    return newRecruitment;
  } catch (error) {
    console.error("Failed to create recruitment:", error);
    throw new Error("リクルート情報の作成に失敗しました");
  }
};

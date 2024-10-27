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
  tags?: string[]; // タグのパラメータを追加
}) => {
  try {
    const queryOptions: any = {
      where: {},
      orderBy: {},
      take: filter.limit || 10,
    };

    // ソート順
    if (filter.sortOrder === "newest") {
      queryOptions.orderBy.created_at = "desc";
    } else if (filter.sortOrder === "oldest") {
      queryOptions.orderBy.created_at = "asc";
    }

    // 場所フィルタ
    if (filter.place) {
      queryOptions.where.place = filter.place;
    }

    // 日付フィルタ
    if (filter.date) {
      queryOptions.where.date = new Date(filter.date);
    }

    console.log("tags", filter.tags);

    // タグフィルタ
    if (filter.tags && filter.tags.length > 0) {
      queryOptions.where.tags = {
        hasSome: filter.tags, // filter.tagsをそのまま使用
      };
    }

    const recruitments = await prisma.recruitment.findMany(queryOptions);

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
    // Retrieve the user's name based on the owner_id
    const user = await prisma.user.findUnique({
      where: { id: recruitmentData.owner_id },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりませんでした");
    }

    // Use the retrieved user's name if `name` is not provided in recruitmentData
    const newRecruitment = await prisma.recruitment.create({
      data: {
        title: recruitmentData.title,
        detail: recruitmentData.detail,
        name: recruitmentData.name,
        date: recruitmentData.date ? new Date(recruitmentData.date) : null,
        sum: recruitmentData.sum ? String(recruitmentData.sum) : "0",
        participants: recruitmentData.participants || [],
        tags: recruitmentData.tags || [],
        owner_id: recruitmentData.owner_id,
        event_url: recruitmentData.event_url,
        owner_name: user.name || "no name",
      },
    });

    return newRecruitment;
  } catch (error) {
    console.error("Failed to create recruitment:", error);
    throw new Error("リクルート情報の作成に失敗しました");
  }
};

export const joinRecruitmentService = async (
  uuid: string,
  recruitment_id: string
): Promise<boolean> => {
  try {
    // Check if the recruitment exists
    const recruitment = await prisma.recruitment.findUnique({
      where: { id: recruitment_id },
    });

    if (!recruitment) {
      throw new Error("Recruitment not found.");
    }

    // Check if the user is the owner
    if (recruitment.owner_id === uuid) {
      throw new Error("User cannot join their own recruitment.");
    }

    // Check if the user is already a participant
    if (recruitment.participants && recruitment.participants.includes(uuid)) {
      throw new Error("User is already joined to this recruitment.");
    }

    // Update the recruitment to add the user to the participants
    await prisma.recruitment.update({
      where: { id: recruitment_id },
      data: {
        participants: {
          push: uuid, // Push the new participant to the array
        },
      },
    });

    return true; // Indicate success
  } catch (error) {
    console.error("Failed to join recruitment:", error);
    throw error; // Rethrow error to be caught by the controller
  }
};

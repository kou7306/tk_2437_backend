import { Request, Response } from "express";
import {
  getRecruitmentService,
  getFilteredRecruitmentsService,
  createRecruitmentService,
  joinRecruitmentService,
} from "../services/recruitmentService";
import { Recruitment } from "../types/Recruitment";

export const getRecruitmentController = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  console.log(id);
  try {
    const recruitment = await getRecruitmentService(id);
    console.log(recruitment);
    res.status(200).json(recruitment);
  } catch (error) {
    console.error("Error fetching recruitment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFilteredRecruitmentController = async (
  req: Request,
  res: Response
) => {
  // クエリパラメータからフィルター情報を取得
  const { sortOrder, limit, place, date, tags } = req.query as {
    sortOrder?: "newest" | "oldest";
    limit?: string;
    place?: string;
    date?: string;
    tags?: string | string[]; // tagsを文字列または文字列の配列として定義
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

    // サービスからフィルターされたリクルート情報を取得
    const recruitments = await getFilteredRecruitmentsService(filter);
    console.log(recruitments);
    res.status(200).json(recruitments);
  } catch (error) {
    console.error("Error fetching filtered recruitments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createRecruitmentController = async (
  req: Request,
  res: Response
) => {
  const recruitmentData = req.body as Recruitment;

  try {
    // サービスを使って新しいイベントを作成
    const newRecruitment = await createRecruitmentService(recruitmentData);
    res.status(200).json(newRecruitment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinRecruitmentController = async (
  req: Request,
  res: Response
) => {
  const { uuid, recruitment_id } = req.body as {
    uuid: string;
    recruitment_id: string;
  };

  try {
    const bool = await joinRecruitmentService(uuid, recruitment_id);
    res.status(200).json(bool);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

import prisma from "../config/prisma";
import { User } from "../types/User";
import { classifyMbti } from "../utils/classifyMbti";

export const getUserService = async (user_id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    return user || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("ユーザー情報の取得に失敗しました");
  }
};

const determineMbti = (answers: (boolean | string[])[][]): { type: string, percentages: number[] } => {
  const categories = [
    { trueType: "V", falseType: "H" }, // イベントスタイル
    { trueType: "S", falseType: "T" }, // 参加形態
    { trueType: "E", falseType: "C" }, // 難易度志向
  ];

  const percentages = categories.map((category, index) => {
    const trueCount = answers[index].filter(answer => answer === true).length;
    return Math.round((trueCount / answers[index].length) * 100);
  });

  const mbti = categories.map((category, index) => {
    const trueCount = answers[index].filter(answer => answer === true).length;
    const falseCount = answers[index].length - trueCount;
    return trueCount >= falseCount ? category.trueType : category.falseType;
  }).join("");

  // 謎解きの正解数に基づいてスキルレベルを判定
  const correctAnswers = ["選択肢1", "選択肢3"]; // 正解の選択肢
  const selectedOptions = answers[3] as unknown as string[]; // 型キャストを修正
  const correctCount = selectedOptions.filter(option => correctAnswers.includes(option)).length;
  const skillLevel = correctCount === 2 ? "A" : correctCount === 1 ? "I" : "N";

  // 4項目目の正答率を計算
  const correctPercentage = Math.round((correctCount / correctAnswers.length) * 100);
  percentages.push(correctPercentage);

  return { type: mbti + skillLevel, percentages };
};

export const registerMbtiService = async (
  user_id: string,
  mbtiAnswers: (boolean | string[])[][]
) => {
  try {
    // 分類ロジック
    const { type: mbtiType, percentages } = determineMbti(mbtiAnswers); // typeとpercentagesを抽出

    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        mbti: mbtiType, // mbtiTypeには4文字のMBTIを格納
        percentage: percentages.map(String) // percentagesを保存
      },
    });
    return true;
  } catch (error) {
    console.error("Error registering MBTI:", error);
    throw new Error("MBTIの登録に失敗しました");
  }
};

export const registerUserService = async (user_id: string) => {
  try {
    await prisma.user.create({
      data: {
        id: user_id,
      },
    });
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("ユーザー情報の登録に失敗しました");
  }
};

export const updateUserService = async (userData: User) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        name: userData.name,
        sex: userData.sex,
        age: userData.age,
        events: userData.events,
        place: userData.place,
        mbti: userData.mbti,
        percentage: userData.percentage,
        detail: userData.detail,
        date: userData.date,
        url: userData.url,
        event_id: userData.event_id,
        participants: userData.participants,
        message: userData.message,
        email: userData.email,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error("ユーザー情報の更新に失敗しました");
  }
};

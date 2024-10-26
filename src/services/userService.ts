import prisma from "../config/prisma";

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

export const registerMbtiService = async (user_id: string, mbtiAnswers: (boolean | string[])[]) => {
  try {
    // 分類ロジック
    const mbtiType = classifyMbti(mbtiAnswers);

    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        mbti: mbtiType,
      },
    });
    return true;
  } catch (error) {
    console.error("Error registering MBTI:", error);
    throw new Error("MBTIの登録に失敗しました");
  }
};

const classifyMbti = (answers: (boolean | string[])[]): number => {
  // 分類ロジック
  const positiveAnswers = answers.filter(answer => answer === true).length;
  console.log("Positive Answers:", positiveAnswers); // ポジティブな回答の数をログに出力
  if (positiveAnswers > answers.length / 2) {
    return 1; // タイプA
  } else {
    return 2; // タイプB
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

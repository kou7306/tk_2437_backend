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

export const registerMbtiService = async (mbti: string) => {
  try {
    await prisma.user.create({
      data: {
        mbti: mbti,
      },
    });
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("ユーザー情報の登録に失敗しました");
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

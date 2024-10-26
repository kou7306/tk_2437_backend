import prisma from "../config/prisma";
import { User } from "../types/User";

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

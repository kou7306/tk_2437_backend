import prisma from "../config/prisma";

export async function getUser(id: string) {
  return await prisma.auth_users.findUnique({
    where: {
      id: id,
    },
  });
}

"use server";
import { prisma } from "@/lib/prisma";

export async function isUsernameAvailable(username: string) {
  if (username.length < 3) return false;
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });
  return !user;
}
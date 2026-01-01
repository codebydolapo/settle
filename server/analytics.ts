"use server";
import { prisma } from "@/lib/prisma";

export async function incrementProfileViews(username: string) {
  try {
    await prisma.user.update({
      where: { username },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    console.error("Failed to track view", e);
  }
}

export async function incrementClick(methodId: string) {
  try {
    await prisma.paymentMethod.update({
      where: { id: methodId },
      data: { clicks: { increment: 1 } },
    });
  } catch (e) {
    console.error("Failed to track click", e);
  }
}
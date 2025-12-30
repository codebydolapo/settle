"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: { name: string; bio: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: formData.name,
      bio: formData.bio,
    },
  });

  revalidatePath("/[username]", "page"); // Refresh the profile page
  return { success: true };
}
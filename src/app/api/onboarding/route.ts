import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { username } = await req.json();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // 1. Check if username is taken in Prisma
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return NextResponse.json({ error: "Username taken" }, { status: 400 });

    // 2. Update Prisma
    await prisma.user.update({
      where: { id: userId },
      data: { username: username },
    });

    // 3. Update Clerk Public Metadata (This tells middleware we are done)
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        username: username,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
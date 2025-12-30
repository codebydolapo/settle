import { prisma } from "@/lib/prisma";

export default async function fetchUser(username: string) {
  // Query Prisma directly for the best performance
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      paymentMethods: {
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  return user;
}
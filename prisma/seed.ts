import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "../src/lib/prisma";
import { Category } from "@/generated/prisma/enums";
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log("🚀 Starting seed process...");
  console.log("🧹 Clearing existing data...");

  await prisma.paymentMethod.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    {
      username: "dolapo",
      id: uuidv4(),
      name: "Dolapo Bashorun",
      email: "dolapo@example.com",
      bio: "Product Designer & Crypto Enthusiast. Sending vibes and invoices.",
      image: "https://avatar.iran.liara.run/public/49",
      views: 1240,
      paymentMethods: [
        {
          providerName: "Wema Bank",
          accountDetails: "9823092923",
          accountName: "Dolapo Bashorun",
          category: Category.BANK,
          clicks: 45,
        },
        {
          providerName: "Ethereum",
          accountDetails: "0x4d932d3922d045f895c938475c8293d02938273",
          accountName: "Main ETH Wallet",
          category: Category.CRYPTO,
          clicks: 128,
        },
      ],
    },
    {
      username: "janismith",
      id: uuidv4(),
      email: "jani@example.com",
      name: "Jani Smith",
      bio: "Freelance Developer. Open for collaborations. ☕️",
      image: "https://avatar.iran.liara.run/public/77",
      views: 890,
      paymentMethods: [
        {
          providerName: "Opay",
          accountDetails: "7012345678",
          accountName: "Jani Tech",
          category: Category.EWALLET,
          clicks: 12,
        },
        {
          providerName: "PayPal",
          accountDetails: "jani.smith@email.com",
          accountName: "Personal",
          category: Category.OTHER,
          clicks: 56,
        },
      ],
    },
  ];

  for (const u of users) {
    const { paymentMethods, ...userData } = u;
    await prisma.user.create({
      data: {
        ...userData,
        paymentMethods: {
          create: paymentMethods,
        },
      },
    });
    console.log(`✅ Created user: ${u.username}`);
  }

  console.log("\n🌱 Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
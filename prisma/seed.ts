import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "../src/lib/prisma";
import { Category } from "@/generated/prisma/enums";

async function seed() {
    console.log("clearing database...");

    await prisma.paymentMethod.deleteMany()
    await prisma.user.deleteMany();

    console.log("Seeding Settle users...");

    const users: Prisma.UserCreateInput[] = [
        {
            username: "dolapo",
            name: "Dolapo Bashorun",
            email: "dolapo@example.com",
            password: "password123", // Remember to hash this in production!
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dolapo",
            paymentMethods: {
                create: [
                    {
                        providerName: "Wema Bank",
                        accountDetails: "9823092923",
                        accountName: "Dolapo Bashorun",
                        category: Category.BANK,
                    },
                    {
                        providerName: "Ethereum",
                        accountDetails: "0x4d932d3922d045f895c938475c8293d02938273",
                        accountName: "Main ETH Wallet",
                        category: Category.CRYPTO,
                    },
                ],
            },
        },
        {
            username: "johndoe",
            email: "john@example.com",
            password: "hashed_password_123", // In a real app, hash this with bcrypt
            name: "John Doe",
            image: "https://avatar.iran.liara.run/public/49",
            paymentMethods: {
                create: [
                    {
                        providerName: "Wema Bank",
                        accountDetails: "0123456789",
                        accountName: "John Doe",
                        category: Category.BANK,
                    },
                    {
                        providerName: "Ethereum",
                        accountDetails: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        accountName: "Main Wallet",
                        category: Category.CRYPTO,
                    },
                ],
            },
        },
        {
            username: "janismith",
            email: "jani@example.com",
            password: "hashed_password_456",
            name: "Jani Smith",
            image: "https://avatar.iran.liara.run/public/77",
            paymentMethods: {
                create: [
                    {
                        providerName: "Opay",
                        accountDetails: "7012345678",
                        accountName: "Jani Tech",
                        category: Category.EWALLET,
                    },
                    {
                        providerName: "PayPal",
                        accountDetails: "jani.smith@email.com",
                        accountName: "Personal",
                        category: Category.OTHER,
                    },
                ],
            },
        },
    ];

    for (const u of users) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user: ${user.username}`);
    }

    console.log("Database seeded successfully! 🌱")
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
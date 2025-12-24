import { Category } from "@/generated/prisma/enums";

export type GetUserQueryResult = {
    user: {
        username: string;
        name: string;
        bio?: string | null;
        image: string;
        paymentMethods: {
            providerName: string;
            accountDetails: string;
            category: Category;
            accountName: string
        }[];
    } | null;
};
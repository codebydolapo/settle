import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { prisma } from "@/lib/prisma";
import { NextRequest } from 'next/server';
import { gql } from "@apollo/client";

const typeDefs = gql`
  enum Category {
    BANK
    CRYPTO
    EWALLET
    OTHER
  }

  type User {
    id: ID!
    username: String!
    paymentMethods: [PaymentMethod!]!
  }

  type PaymentMethod {
    id: ID!
    providerName: String!
    accountDetails: String!
    accountName: String
    category: Category
  }

  input AddPaymentInput {
    userId: String!
    providerName: String!
    accountDetails: String!
    accountName: String
    category: Category
  }

  type Query {
    user(username: String!): User
  }

  type Mutation {
    addPaymentMethod(input: AddPaymentInput!): PaymentMethod
  }
`;

const resolvers = {
    Query: {
        user: async (_: any, { username }: { username: string }) => {
            return await prisma.user.findUnique({
                where: { username },
                include: { paymentMethods: true },
            });
        },
    },
    Mutation: {
        addPaymentMethod: async (_: any, { input }: { input: any }) => {
            return await prisma.paymentMethod.create({
                data: {
                    providerName: input.providerName,
                    accountDetails: input.accountDetails,
                    accountName: input.accountName,
                    category: input.category,
                    user: {
                        connect: { id: input.userId },
                    },
                },
            });
        },
    },
};

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Create the Next.js Handler
const handler = startServerAndCreateNextHandler<NextRequest>(server);

// Export the handler for GET and POST
export { handler as GET, handler as POST };
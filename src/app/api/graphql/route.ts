import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { prisma } from "@/lib/prisma";
import { NextRequest } from 'next/server';
import { gql } from "@apollo/client";
// import { auth } from "@/auth";
import { getAuth } from "@clerk/nextjs/server";

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
    name: String!
    bio: String
    image: String
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

  input UpdateProfileInput {
    name: String
    bio: String
    username: String
  }

  type Query {
    me: User
    user(username: String!): User
    checkUsername(username: String!): Boolean
  }

  type Mutation {
    addPaymentMethod(input: AddPaymentInput!): PaymentMethod
    deletePaymentMethod(id: ID!): Boolean 
    updateUser(input: UpdateProfileInput!): User # Add this
  }
`;

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.userId) return null;
      return await prisma.user.findUnique({
        where: { id: context.userId },
        include: { paymentMethods: true },
      });
    },
    user: async (_: any, { username }: { username: string }) => {
      return await prisma.user.findUnique({
        where: { username },
        include: { paymentMethods: true },
      });
    },
    checkUsername: async (_: any, { username }: { username: string })=>{
      return !(await prisma.user.findUnique({ where: { username } }))
    }
  },
  Mutation: {
    addPaymentMethod: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");

      return await prisma.paymentMethod.create({
        data: {
          ...input,
          userId: context.userId // Use the verified Clerk ID
        }
      });
    },
    deletePaymentMethod: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");

      // Safety check: Ensure the user owns this payment method
      const method = await prisma.paymentMethod.findUnique({ where: { id } });
      if (!method || method.userId !== context.userId) throw new Error("Forbidden");

      await prisma.paymentMethod.delete({ where: { id } });
      return true;
    },
    updateUser: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.userId) throw new Error("Unauthorized");

      // If username is being changed, Prisma will automatically throw an error 
      // if it's not unique because of the @unique constraint.
      return await prisma.user.update({
        where: { id: context.userId },
        data: {
          name: input.name,
          bio: input.bio,
          username: input.username?.toLowerCase().trim(),
        },
      });
    },
  }
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create the Next.js Handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const { userId } = getAuth(req);
    return { userId };
  },
});

// Export the handler for GET and POST
export { handler as GET, handler as POST };
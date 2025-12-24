import { Category, Prisma } from "@/generated/prisma/browser";
import { getClient } from "@/lib/apollo-server";
import { gql } from "@apollo/client";
import { GetUserQueryResult } from "../types/getUserQueryResult";

const GET_USER_PROFILE = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      username
      name
      bio
      paymentMethods {
        id
        providerName
        accountDetails
        category
      }
    }
  }
`;

async function fetchUser(
    username: string
): Promise<GetUserQueryResult["user"] | undefined> {
    const { data } = await getClient().query<GetUserQueryResult>({
        query: GET_USER_PROFILE,
        variables: { username },
    });
    return data?.user ?? undefined;
}

export default fetchUser
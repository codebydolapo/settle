import { HttpLink } from "@apollo/client";
import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";

export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // Point to your local API route
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
    }),
  });
});
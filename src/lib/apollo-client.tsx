import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// const _ApolloClient = new ApolloClient({
//   link: new HttpLink({ uri: "https://flyby-router-demo.herokuapp.com/" }),
//   cache: new InMemoryCache(),
// });

// export default _ApolloClient;


const _ApolloClient = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  const client = new ApolloClient({
    link: new HttpLink({ uri: "https://flyby-router-demo.herokuapp.com/" }),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
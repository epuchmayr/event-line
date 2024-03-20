import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
    uri: 'https://suitable-martin-44.hasura.app/v1/graphql',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
    },
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    }),
  });
});
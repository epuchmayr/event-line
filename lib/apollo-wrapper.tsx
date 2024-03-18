'use client';

import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { env } from 'process';

function makeClient() {
  const httpLink = new HttpLink({
    // https://studio.apollographql.com/public/spacex-l4uc6p/
    // uri: 'https://countries.trevorblades.com',
    uri: 'https://suitable-martin-44.hasura.app/v1/graphql',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
    },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

// export function ApolloWrapper({ children }: React.PropsWithChildren) {
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

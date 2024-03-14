'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import gql from 'graphql-tag';

export const dynamic = 'force-dynamic';

const query = gql`
  query ExampleQuery {
    countries {
      code
      name
      emoji
    }
  }
`;

type Country = {
  code: string;
  name: string;
  emoji: string;
};

export default function PollPage() {
  const { data }: { data: { countries: [Country] } } = useSuspenseQuery(query);

  const cIndex = 35;

  const top4 = data.countries.slice(cIndex, cIndex + 4);

  return (
    <div>
      {top4.map((country) => {
        return (
          <div key={country.code}>
            {country.name} - {country.emoji}
          </div>
        );
      })}
    </div>
  );
}

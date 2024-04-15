'use client';
import { useState } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import gql from 'graphql-tag';

export const dynamic = 'force-dynamic';

const query = gql`
  query ExampleQuery {
    countries {
      code
      name
      emoji
      currency
    }
  }
`;

type Country = {
  code: string;
  name: string;
  emoji: string;
  currency: string;
};

export default function PollPage() {
  const { data }: { data: { countries: [Country] } } = useSuspenseQuery(query);

  const cIndex = 60;

  const top4 = data.countries.slice(cIndex, cIndex + 10);

  const [form, setForm] = useState({ filter: '' });

  return (
    <div>
      <input
        onChange={(e) => {
          setForm({ ...form, filter: e.target.value });
        }}
        value={form.filter}
        placeholder={'filter countries by name'}
      />
      {data.countries
        .filter((country) =>
          country.name.toLowerCase().includes(form.filter.toLowerCase())
        )
        .map((country) => {
          return (
            <div key={country.code}>
              {country.name} - {country.emoji} {country.currency}
            </div>
          );
        })}
      {/* {top4.map((country) => {
        return (
          <div key={country.code}>
            {country.name} - {country.emoji} {country.currency}
          </div>
        );
      })} */}
    </div>
  );
}

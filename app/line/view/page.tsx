'use client';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { GeminiEffect } from '@/components/motion/GeminiEffect';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

export const dynamic = 'force-dynamic';

type Event = {
  id: string;
  name: string;
  content: string;
  author: string;
};

const query = gql`
  query Events {
    events {
      id
      name
      content
      author
    }
  }
`;


function SuspenseFallback() {
  return <div>Loading...</div>;
}


function List({filterString}: {filterString: string}) {
  const { data }: { data: { events: [Event] } | undefined } = useSuspenseQuery(query, {
        errorPolicy: 'all',
      });

  return (
    <ol>
      {data && data.events
            .filter(
              (event) =>
                event.name.toLowerCase().includes(filterString.toLowerCase()) ||
                event.content.toLowerCase().includes(filterString.toLowerCase())
            )
            .map((event) => {
              return (
                <div key={event.id}>
                  {event.id} - {event.name} - {event.content} - {event.author}
                </div>
              );
            })}
    </ol>
  );
}

export default function Page() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  const [form, setForm] = useState({ filter: '' });

  return (
    <div
      className='h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip'
      ref={ref}
    >
      <h1>View line</h1>
      <GeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />

      <div className='sticky top-10'>
        <input
          onChange={(e) => {
            setForm({ ...form, filter: e.target.value });
          }}
          value={form.filter}
          placeholder={'filter by name'}
        />
        <Suspense fallback={<SuspenseFallback />}>
          <List filterString={form.filter} />
        </Suspense>
      </div>
    </div>
  );
}


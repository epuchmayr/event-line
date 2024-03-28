'use client';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { GeminiEffect } from '@/components/motion/GeminiEffect';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

export const dynamic = 'force-dynamic';

type Event = {
  id: string;
  event_name: string;
  event_start_date: string;
  event_end_date: string;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
  event_content: string;
  event_tags: string;
  event_privacy: string;
  user_id: string;
  user_full_name: string;
};

const query = gql`
  query Events {
    events {
      id
      event_name
      event_start_date
      event_end_date
      event_start_time
      event_end_time
      event_description
      event_content
      event_tags
      event_privacy
      user_id
      user_full_name
    }
  }
`;

// const query = gql`
//   query {
//     launchLatest {
//       mission_name
//       launch_date_local
//       launch_site {
//         site_name_long
//       }
//       links {
//         article_link
//         video_link
//       }
//       rocket {
//         rocket_name
//         rocket_type
//       }
//       ships {
//         name
//         home_port
//         image
//       }

//     }
//   }
// `;

function SuspenseFallback() {
  return <div>Loading...</div>;
}

function List({ filterString }: { filterString: string }) {
  const { data }: { data: { events: [Event] } | undefined } = useSuspenseQuery(
    query,
    {
      errorPolicy: 'all',
    }
  );

  return (
    <ol>
      {/* {JSON.stringify(data)} */}
      {data &&
        data.events
          .filter(
            (event) =>
              event.user_full_name.toLowerCase().includes(filterString.toLowerCase()) ||
              event.event_description.toLowerCase().includes(filterString.toLowerCase())
          )
          .map((event) => {
            return (
              <div key={event.id}>
                {event.id} - {event.user_full_name} - {event.event_name}
                 - {event.event_description} - {event.event_start_date}
                 - {event.user_id} - {event.event_content}
                 - {event.event_tags} - {event.event_privacy}
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

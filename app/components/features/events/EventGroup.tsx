'use client';
import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
  ReactNode,
  createContext,
} from 'react';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import {
  initializeEvents,
  addEvent,
  removeEvent,
  selectEvents,
} from '@/lib/features/events/eventsSlice';

// 3D EFFECTS
import { useScroll, useTransform } from 'framer-motion';
import { GeminiEffect } from '@/app/components/motion/GeminiEffect';
import { positionView } from 'three/examples/jsm/nodes/Nodes.js';

// SHADCN COMPONENTS
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { TypographyP } from '@/app/components/ui/typography';
import { Input } from '@/app/components/ui/input';

// DATE / FORM FUNCTIONS
import {
  addDays,
  format,
  addHours,
  differenceInCalendarDays,
  getDaysInMonth,
} from 'date-fns';
import { date } from 'zod';

// APP COMPONENTS
import EventLine from './EventLine';
import EventList from './EventList';
import { EventContext } from '@/app/line/view/eventContext';

import { EventType } from '@/types/global';

// GQL
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

// APP COMPONENTS
import Events from './Events';
import Markers from './Markers';

const query = gql`
  query Events {
    events(order_by: { event_start_date: asc }) {
      id
      event_name
      event_content
      event_description
      event_image
      event_start_date
      event_end_date
      event_range_date
      event_start_time
      event_end_time
      event_tags
      event_privacy
      user_id
      user_full_name
    }
  }
`;

function SuspenseFallback() {
  return <div>Loading events...</div>;
}

const testData = {
  events: [
    {
      id: '1',
      event_name: 'event_name',
      event_content: 'event_content',
      event_description: 'event_description',
      event_image: 'event_image',
      event_start_date: 'event_start_date',
      event_end_date: 'event_end_date',
      event_range_date: 'event_range_date',
      event_start_time: 'event_start_time',
      event_end_time: 'event_end_time',
      event_tags: 'event_tags',
      event_privacy: 'event_privacy',
      user_id: 'user_id',
      user_full_name: 'user_full_name',
    } as EventType,
  ],
};

export default function EventGroup({ filterString }: { filterString: string }) {
  const events = useSelector(selectEvents);

  // console.log(events);

  const memoisedEventLine = useCallback(
    () => <EventLine eventData={events} filterString={filterString} />,
    [filterString, events]
  );

  const memoisedEventList = useCallback(
    () => <EventList filterString={filterString} />,
    [filterString]
  );
  const {
    error,
    data,
  }: { error?: any; data: { events: [EventType] } | undefined } =
    useSuspenseQuery(query, {
      errorPolicy: 'all',
    });
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div className='flex flex-auto gap-2 px-4 overflow-hidden'>
        <div className='flex-auto'>
          <Suspense fallback={<SuspenseFallback />}>
            {memoisedEventLine()}
          </Suspense>
        </div>
        <div className='w-72 overflow-auto'>
          <Suspense fallback={<SuspenseFallback />}>
            {memoisedEventList()}
          </Suspense>
        </div>
      </div>
    </>
  );
}

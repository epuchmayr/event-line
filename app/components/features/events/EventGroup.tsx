'use client';
import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
  useContext,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import CalendarFull from '@/app/components/ui/calendar-full';

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

import { EventType, SubObject } from '@/types/global';

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
  const [currentView, setCurrentView] = useState<'TIMELINE' | 'CALENDAR'>(
    'TIMELINE'
  );
  const [calendarView, setCalendarView] = useState<
    'MONTH' | 'DAY' | 'WEEK_TIME'
  >('MONTH');

  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString());

  const { activeEvent, setActiveEvent } = useContext(EventContext);
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
  if (error) return <p>Unable to retrieve events, try refreshing :(</p>;

  const calendarData =
    data &&
    data.events?.map((event) => {

    // create a subset user data
    var subset = [
      'event_name',
      'event_content',
      'event_description',
      'user_full_name',
    ].reduce(function (subObj: SubObject, key: string) {
      if (key in event) subObj[key] = event[key];
      return subObj;
    }, {});

    // filter the subset object
    const isFiltered = JSON.stringify(Object.values(subset))
      .toLowerCase()
      .includes(filterString.toLowerCase());
      
      return isFiltered && {
        id: event.id,
        startTime: event.event_start_date,
        endTime: event.event_end_date ?? event.event_start_date,
        title: event.event_name,
      };
    });

    useEffect(() => {
      if (activeEvent.event_start_date) {
        console.log('activeEvent', activeEvent.event_start_date);
        setCurrentDate(activeEvent.event_start_date)
      }
    }, [activeEvent])

  return (
    <>
      <div className='flex flex-auto gap-2 px-4 overflow-hidden'>
        <div className='flex-auto flex flex-col'>
          <div className='flex gap-2 pb-4'>
            <Button
              variant={currentView === 'TIMELINE' ? 'secondary' : 'outline'}
              onClick={() => setCurrentView('TIMELINE')}
            >
              Timeline
            </Button>
            <Button
              variant={currentView === 'CALENDAR' ? 'secondary' : 'outline'}
              onClick={() => setCurrentView('CALENDAR')}
            >
              Calendar
            </Button>
            {currentView === 'CALENDAR' ? (
              <Select
                value={calendarView}
                onValueChange={(e) => {
                  setCalendarView(e as typeof calendarView);
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select privacy' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='MONTH'>Month</SelectItem>
                    <SelectItem value='WEEK_TIME'>Week</SelectItem>
                    <SelectItem value='DAY'>Day</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : null}
            {/* <Button onClick={() => setCurrentDate('2023-06-02')}>Set date</Button> */}
          </div>
          <div className='flex-auto overflow-auto'>
            {currentView === 'TIMELINE' ? (
              <Suspense fallback={<SuspenseFallback />}>
                {memoisedEventLine()}
              </Suspense>
            ) : (
              <>
                <CalendarFull
                  currentView={calendarView}
                  data={calendarData as Record<string, any>[]}
                  onItemClick={setActiveEvent}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              </>
            )}
          </div>
        </div>
        <div className='w-72 flex-none overflow-auto'>
          <Suspense fallback={<SuspenseFallback />}>
            {memoisedEventList()}
          </Suspense>
        </div>
      </div>
    </>
  );
}

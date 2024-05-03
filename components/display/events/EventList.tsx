'use client';
import { useRef, createRef, useState, useContext } from 'react';

// GQL
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

// DATE / FORM FUNCTIONS
import {
  addDays,
  format,
  addHours,
  differenceInCalendarDays,
  getDaysInMonth,
} from 'date-fns';

// SHADCN COMPONENTS
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';

import { SubObject, EventType } from '@/types/global';

import Tags from './Tags';

import { EventContext } from '@/app/line/view/page';

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

export default function EventList({ filterString }: { filterString: string }) {
  const {
    error,
    data,
  }: { error?: any; data: { events: [EventType] } | undefined } =
    useSuspenseQuery(query, {
      errorPolicy: 'all',
    });
  const { activeEvent, setActiveEvent } = useContext(EventContext);
  const [hasFocus, setHasFocus] = useState(false);

  // React ref to store array of refs
  const eventRefs = useRef<React.MutableRefObject<HTMLDivElement>[]>([]);

  if (error || !data) return <p>Error :(</p>;

  eventRefs.current = [...Array(data.events.length).keys()].map(
    (_, i) => eventRefs.current[i] ?? createRef()
  );

  const scrollSmoothHandler = (index: number) => {
    // console.log('scrolling into view', eventRefs.current[index].current);
    if (!hasFocus) {
      const currentRef = eventRefs.current[index]?.current;
      if (currentRef) {
        currentRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div
        onPointerEnter={() => setHasFocus(true)}
        onPointerLeave={() => setHasFocus(false)}
      >
        {data.events.map((item: EventType, index) => {
          // create a subset user data
          var subset = [
            'event_name',
            'event_content',
            'event_description',
            'user_full_name',
          ].reduce(function (subObj: SubObject, key: string) {
            if (key in item) subObj[key] = item[key];
            return subObj;
          }, {});

          // filter the subset object
          const isFiltered = JSON.stringify(Object.values(subset))
            .toLowerCase()
            .includes(filterString.toLowerCase());

          const currentEvent = activeEvent === item.id;

          if (eventRefs.current && currentEvent) {
            // console.log('scrolling into view', eventRefs.current, index, eventRefs.current[index])
            scrollSmoothHandler(index);
          }

          return (
            <div key={'List_' + item.id}>
              <Card
                className={`rounded-none border-t-0 ${
                  activeEvent === item.id ? 'bg-slate-800' : ''
                }`}
                style={{
                  opacity: isFiltered ? 1 : 0.75,
                  height: isFiltered ? undefined : '22px',
                  overflow: isFiltered ? undefined : 'hidden',
                  pointerEvents: isFiltered ? 'auto' : 'none',
                }}
                tabIndex={isFiltered ? 0 : -1}
                onPointerEnter={() => setActiveEvent(item.id)}
                onFocus={() => {
                  setHasFocus(true);
                  setActiveEvent(item.id);
                }}
                onBlur={() => setHasFocus(false)}
                ref={eventRefs.current[index]}
              >
                <CardHeader>
                  <CardTitle className='truncate text-base'>
                    {item.event_name}
                  </CardTitle>
                  {/* <CardDescription>
                    <span>{item.event_description}</span>
                  </CardDescription> */}
                  {/* {item.event_image && (
                  <img src={item.event_image} alt={item.event_name} />
                )} */}
                </CardHeader>
                <CardContent>
                  <TypographyP>{item.event_content}</TypographyP>
                  <CardDescription className='mt-5'>
                    <span>
                      {new Date(item.event_start_date).toDateString()}
                    </span>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  {/* <p>{item.user_full_name}</p> */}
                  <Tags tags={item.event_tags} />
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}

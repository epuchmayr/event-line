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

import { EventType, FilteredEventType } from '@/types/global';

import Tags from './Tags';

import { EventContext } from '@/app/line/view/eventContext';

import { userFriendlyTime } from './helpers';

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

export default function EventList({
  eventData,
  filterString,
}: {
  eventData: { events: FilteredEventType[] };
  filterString: string;
}) {
  const { activeEvent, setActiveEvent } = useContext(EventContext);
  const [hasFocus, setHasFocus] = useState(false);

  // React ref to store array of refs
  const eventRefs = useRef<React.MutableRefObject<HTMLDivElement>[]>([]);

  eventRefs.current = [...Array(eventData.events.length).keys()].map(
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
        {[...eventData.events].reverse().map((event: FilteredEventType, index) => {

          const currentEvent = activeEvent.id === event.id;

          if (eventRefs.current && currentEvent) {
            // console.log('scrolling into view', eventRefs.current, index, eventRefs.current[index])
            scrollSmoothHandler(index);
          }

          return (
            <div key={'List_' + event.id}>
              <Card
                className={`rounded-none border-t-0 ${
                  activeEvent.id === event.id ? 'bg-slate-800' : ''
                }`}
                style={{
                  opacity: event.isFiltered ? 1 : 0.75,
                  height: event.isFiltered ? undefined : '22px',
                  overflow: event.isFiltered ? undefined : 'hidden',
                  pointerEvents: event.isFiltered ? 'auto' : 'none',
                }}
                tabIndex={event.isFiltered ? 0 : -1}
                onPointerEnter={() => setActiveEvent(event)}
                onFocus={() => {
                  setHasFocus(true);
                  setActiveEvent(event);
                }}
                onBlur={() => setHasFocus(false)}
                ref={eventRefs.current[index]}
              >
                <CardHeader>
                  <CardTitle className='truncate text-base'>
                    {event.event_name}
                  </CardTitle>
                  {/* <CardDescription>
                    <span>{item.event_description}</span>
                  </CardDescription> */}
                  {/* {item.event_image && (
                  <img src={item.event_image} alt={item.event_name} />
                )} */}
                </CardHeader>
                <CardContent>
                  <TypographyP>{event.event_content}</TypographyP>
                  <CardDescription className='mt-5'>
                    <span>
                      {new Date(event.event_start_date).toDateString()}
                      <br />
                      {event.event_start_time &&
                        `${userFriendlyTime(event.event_start_time)}`}
                      {event.event_end_time &&
                        ` - ${userFriendlyTime(event.event_end_time)}`}
                    </span>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  {/* <p>{item.user_full_name}</p> */}
                  <Tags tags={event.event_tags} />
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}

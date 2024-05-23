'use client';
import React, {
  useEffect,
  useState,
  Suspense,
  useContext,
  useMemo,
} from 'react';

// REDUX
import { useSelector, useDispatch } from 'react-redux';

// SHADCN COMPONENTS
import { Button } from '@/components/ui/button';

// APP COMPONENTS
import EventLine from './EventLine';
import EventList from './EventList';
import { EventContext } from '@/app/line/view/eventContext';

import Calendar, { CalendarDayHeader } from '../../calendar/month/Calendar';
import YearCal, { CalendarMonthHeader } from '../../calendar/year/YearCal';

import { EventType, FilteredEventType } from '@/types/global';

// GQL
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

// import { Events as query } from './Events.graphql';
import { DayObjectType } from '../../calendar/month/helpers';
import dayjs from 'dayjs';

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

export default function EventGroup({ filterString }: { filterString: string }) {
  const [currentView, setCurrentView] = useState<
    'TIMELINE' | 'CALENDAR' | 'YEAR'
  >('TIMELINE');

  const newDate = new Date();

  const [currentDate, setCurrentDate] = useState<string>(newDate.toISOString());

  const {
    error,
    data,
  }: { error?: any; data: { events: [EventType] } | undefined } =
    useSuspenseQuery(query, {
      errorPolicy: 'all',
    });

  const filteredData: FilteredEventType[] = useMemo(
    () =>
      (data &&
        data.events?.map((event) => {
          const {
            event_name,
            event_content,
            event_description,
            user_full_name,
          } = event;

          const subset = [
            event_name,
            event_content,
            event_description,
            user_full_name,
          ]
            .join(' ')
            .toLowerCase();

          // filter the subset object
          const isFiltered = subset.includes(filterString.toLowerCase());

          return { ...event, isFiltered: isFiltered };
        })) ||
      [],
    [data, filterString]
  );

  // Calendar current view
  const [yearMonthDay, setYearMonthDay] = useState<number[]>([
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    newDate.getDate(),
  ]);

  // use provider
  const { activeEvent, setActiveEvent } = useContext(EventContext);

  // console.log('filteredData ', { events: filteredData }, events);
  const memoisedEventLine = useMemo(
    () => (
      <EventLine
        eventData={{ events: filteredData }}
        filterString={filterString}
      />
    ),
    [filterString, filteredData]
  );

  const memoisedEventList = useMemo(
    () => <EventList filterString={filterString} />,
    [filterString]
  );

  useEffect(() => {
    if (activeEvent.event_start_date) {
      const startDate = dayjs(activeEvent.event_start_date);
      setCurrentDate(activeEvent.event_start_date);
      setYearMonthDay([
        startDate.get('year'),
        startDate.get('month') + 1,
        startDate.get('date'),
      ]);
    }
  }, [activeEvent]);

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
            <Button
              variant={currentView === 'YEAR' ? 'secondary' : 'outline'}
              onClick={() => setCurrentView('YEAR')}
            >
              Year
            </Button>
          </div>
          <div className='flex-auto overflow-auto'>
            {currentView === 'TIMELINE' && (
              <Suspense fallback={<SuspenseFallback />}>
                {memoisedEventLine}
              </Suspense>
            )}
            {currentView === 'CALENDAR' && (
              <>
                <Calendar
                  yearMonthDay={yearMonthDay}
                  onYearMonthDayChange={setYearMonthDay}
                  renderDay={(calendarDayObject: DayObjectType) => (
                    <div>
                      <CalendarDayHeader
                        calendarDayObject={calendarDayObject}
                      />
                    </div>
                  )}
                  data={filteredData}
                  handleEventClick={setActiveEvent}
                  activeEvent={activeEvent}
                  selectedDate={currentDate}
                />
              </>
            )}
            {currentView === 'YEAR' && (
              <>
                <YearCal
                  yearMonthDay={yearMonthDay}
                  onYearMonthDayChange={setYearMonthDay}
                  // renderDay={(calendarDayObject: DayObjectType) => (
                  //   <div>
                  //     <CalendarMonthHeader
                  //       calendarDayObject={calendarDayObject}
                  //     />
                  //   </div>
                  // )}
                  data={filteredData}
                  handleEventClick={setActiveEvent}
                  activeEvent={activeEvent}
                  selectedDate={currentDate}
                />
              </>
            )}
          </div>
        </div>
        <div className='flex-none overflow-auto w-40 sm:w-min'>
          <Suspense fallback={<SuspenseFallback />}>
            {memoisedEventList}
          </Suspense>
        </div>
      </div>
    </>
  );
}

'use client';
import { useState } from 'react';

import { EventType } from '@/types/global';

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

export default function EventLine({
  eventData,
  filterString,
}: {
  eventData: { events: EventType[] };
  filterString: string;
}) {
  const {
    error,
    data,
  }: { error?: any; data: { events: [EventType] } | undefined } =
    useSuspenseQuery(query, {
      errorPolicy: 'all',
    });
  if (error) return <p>Error :(</p>;

  // const data = eventData;

  // console.log(data)

  // console.log(data!.events.map(event => new Date(event.event_start_date).getTime()))
  // const data = {
  //   events: [
  //     {
  //       __typename: 'events',
  //       id: '1f498de1-8bee-4945-b6e3-030301d714f0',
  //       event_name: 'Back in March',
  //       event_content: "i'm sure some cool stuff was going on",
  //       event_description: 'what was happening',
  //       event_image: '{}',
  //       event_start_date: '2024-03-20T07:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date:
  //         '{\n  "from": "2024-04-18T22:50:49.258Z",\n  "to": "2024-04-25T22:50:49.439Z"\n}',
  //       event_start_time:
  //         '{\n  "hour": 15,\n  "minute": 50,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_end_time:
  //         '{\n  "hour": 16,\n  "minute": 50,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_tags:
  //         '[\n  {\n    "label": "Event",\n    "value": "event"\n  },\n  {\n    "label": "Family",\n    "value": "family"\n  },\n  {\n    "label": "Travel",\n    "value": "travel"\n  },\n  {\n    "label": "Household",\n    "value": "household"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '052d1a00-1064-486d-ac5f-21e92963a731',
  //       event_name: 'test',
  //       event_content: 'test content',
  //       event_description: null,
  //       event_image: null,
  //       event_start_date: '2024-04-01T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'hidden',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'cooldude',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '80c260c4-97ff-46e3-9012-953501fda4e3',
  //       event_name: 'April Fools',
  //       event_content: 'keep on keeping on',
  //       event_description: 'nothing to see here',
  //       event_image: '{}',
  //       event_start_date: '2024-04-01T07:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date:
  //         '{\n  "from": "2024-04-18T23:16:20.365Z",\n  "to": "2024-04-25T23:16:20.545Z"\n}',
  //       event_start_time:
  //         '{\n  "hour": 16,\n  "minute": 16,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_end_time:
  //         '{\n  "hour": 17,\n  "minute": 16,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_tags:
  //         '[\n  {\n    "label": "Personal",\n    "value": "personal"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: 'fb940ec5-91cf-47e8-b073-49e94ef3cbf5',
  //       event_name: 'events',
  //       event_content: 'this is the second event',
  //       event_description: null,
  //       event_image: null,
  //       event_start_date: '2024-04-03T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'hidden',
  //       user_id: null,
  //       user_full_name: 'it me',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '968da2cf-141c-4351-8b54-3da31b7b7ef9',
  //       event_name: 'April Sun',
  //       event_content:
  //         "It's a really nice day today, we should all go outside.",
  //       event_description: 'What a beautiful day!',
  //       event_image: null,
  //       event_start_date: '2024-04-04T00:00:00+00:00',
  //       event_end_date: '2024-04-05T00:00:00+00:00',
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: 'a45abe33-27be-4e85-bfa1-c0a5a4731b32',
  //       event_name: 'will it route',
  //       event_content: "i'm pretty sure it will",
  //       event_description: 'i just want to see',
  //       event_image: null,
  //       event_start_date: '2024-04-04T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: 'b4c2655e-ce48-4166-b933-b1b4328641e7',
  //       event_name: 'test',
  //       event_content: 'testest',
  //       event_description: 'tests',
  //       event_image: null,
  //       event_start_date: '2024-04-04T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: 'a043a306-80e4-4325-b693-26a77b67297a',
  //       event_name: 'thurs',
  //       event_content: 'more about thursday',
  //       event_description: 'thursday desc',
  //       event_image: null,
  //       event_start_date: '2024-04-05T00:00:00+00:00',
  //       event_end_date: '2024-04-06T00:00:00+00:00',
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: 'a6fdc46f-8f37-4489-81fb-8690b7a5a6ea',
  //       event_name: 'route from app',
  //       event_content: 'i think this will now work? fingers crossed',
  //       event_description: 'gotta use nav in app',
  //       event_image: null,
  //       event_start_date: '2024-04-07T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags: '[  {    "label": "Event",    "value": "event"  }  ]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '2d6d842e-1819-40e6-894a-6364d974e7ac',
  //       event_name: 'test tags',
  //       event_content: null,
  //       event_description: null,
  //       event_image: null,
  //       event_start_date: '2024-04-12T00:00:00+00:00',
  //       event_end_date: null,
  //       event_range_date: null,
  //       event_start_time: null,
  //       event_end_time: null,
  //       event_tags:
  //         '[\n  {\n    "label": "Event",\n    "value": "event"\n  },\n  {\n    "label": "Friends",\n    "value": "friends"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '839eaae3-db94-4c70-b657-d1cedbd9be20',
  //       event_name: 'final test?',
  //       event_content: 'content',
  //       event_description: 'desc',
  //       event_image: '{\n  "0": {}\n}',
  //       event_start_date: '2024-04-17T21:27:36.144+00:00',
  //       event_end_date: null,
  //       event_range_date:
  //         '{\n  "from": "2024-04-17T21:27:36.144Z",\n  "to": "2024-04-24T21:27:36.328Z"\n}',
  //       event_start_time:
  //         '{\n  "hour": 14,\n  "minute": 27,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_end_time:
  //         '{\n  "hour": 15,\n  "minute": 27,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_tags:
  //         '[\n  {\n    "label": "Event",\n    "value": "event"\n  },\n  {\n    "label": "Travel",\n    "value": "travel"\n  },\n  {\n    "label": "Family",\n    "value": "family"\n  },\n  {\n    "label": "Friends",\n    "value": "friends"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '54c48c58-addd-45b2-bef5-732c5d244b4d',
  //       event_name: 'Passing data works',
  //       event_content:
  //         'after switching from MUI to shadcn the form finally works as intended',
  //       event_description: 'i can finally pass data',
  //       event_image: '{\n  "0": {}\n}',
  //       event_start_date: '2024-04-17T21:35:39.31+00:00',
  //       event_end_date: null,
  //       event_range_date:
  //         '{\n  "from": "2024-04-12T07:00:00.000Z",\n  "to": "2024-04-17T07:00:00.000Z"\n}',
  //       event_start_time:
  //         '{\n  "hour": 10,\n  "minute": 35,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_end_time:
  //         '{\n  "hour": 14,\n  "minute": 35,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_tags:
  //         '[\n  {\n    "label": "Event",\n    "value": "event"\n  },\n  {\n    "label": "Household",\n    "value": "household"\n  },\n  {\n    "label": "Work",\n    "value": "Work"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //     {
  //       __typename: 'events',
  //       id: '9fe7a4c9-e7c6-4e0a-9b30-49a152c15ae6',
  //       event_name: 'Check my line',
  //       event_content:
  //         "what a day, we have the line looking nice and it's loading data and spreading",
  //       event_description: 'how good is this as a description',
  //       event_image: '{}',
  //       event_start_date: '2024-04-18T22:13:28.509+00:00',
  //       event_end_date: null,
  //       event_range_date:
  //         '{\n  "from": "2024-04-18T22:13:28.509Z",\n  "to": "2024-04-25T22:13:28.696Z"\n}',
  //       event_start_time:
  //         '{\n  "hour": 15,\n  "minute": 13,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_end_time:
  //         '{\n  "hour": 16,\n  "minute": 13,\n  "second": 0,\n  "millisecond": 0\n}',
  //       event_tags:
  //         '[\n  {\n    "label": "Event",\n    "value": "event"\n  }\n]',
  //       event_privacy: 'visible',
  //       user_id: 'user_2db95hM44CF8Y6sYthrvAbKr9Ty',
  //       user_full_name: 'Eric Puchmayr',
  //     },
  //   ],
  // };
  if (!data) return <p>No data returned</p>;

  // if (filteredData.length === 0) {
  //   return <p>No events found with that filter</p>;
  // }

  const eventStartArray = data.events.map((event) =>
    new Date(event.event_start_date).getTime()
  );

  const firstItem = eventStartArray[0];
  const firstMonth = new Date(firstItem).getMonth();
  let lastItem = firstItem;
  let lastMonth = firstMonth;
  let work = 0;

  if (eventStartArray.length > 1) {
    lastItem = eventStartArray.at(-1) as number;
    work = (lastItem - firstItem) / 100;
    lastMonth = new Date(+lastItem!).getMonth();
  }

  ///////////////////////////////////////////////////////////
  // calculate month range
  const lastMonthTimestamp = new Date().setMonth(lastMonth + 1);
  const firstMonthTimestamp = new Date().setMonth(firstMonth);

  const firstDay = new Date(firstItem).getDate();
  const lastDay = new Date(lastItem).getDate();
  const daysInLastMonth = getDaysInMonth(lastMonthTimestamp);

  // const perDay = (lastMonthTimestamp - firstMonthTimestamp) / 100;
  const differenceInDays = differenceInCalendarDays(
    new Date(lastItem),
    new Date(firstItem)
  );

  const dayAsPercentage = (100 / (differenceInDays + daysInLastMonth)).toFixed(
    2
  );
  const leftMonthMargin = +dayAsPercentage * firstDay;
  const rightMonthMargin = +dayAsPercentage * (daysInLastMonth - lastDay);

  // console.log(firstItem, firstMonth, lastItem, lastMonth, 'work', work, perDay, differenceInDays)
  // console.log(leftMonthMargin, rightMonthMargin)

  //////////////////////////////////////////////////////////

  // calculate position of each event point
  const eventPointPosition =
    eventStartArray.length > 1
      ? eventStartArray.map((num) => {
          return ((num - firstItem) / work).toFixed(2);
        })
      : ['1'];
  // console.log('work', work, eventPointPosition);

  // generate array of months
  const monthsArray = Array.from(
    { length: lastMonth - firstMonth + 2 },
    (e, i) => i + firstMonth + 1
  );
  function getMonthName(monthNumber: number) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
      month: 'long',
    });
  }

  // calculate position of each month marker
  const markersCount = monthsArray.length;
  const markers = monthsArray.map((item, index) => {
    const markerPosition =
      markersCount > 1 ? (index / (markersCount - 1)) * 100 : 1;
    return { name: getMonthName(item), position: markerPosition };
  });

  // console.log('markers', markers, firstItem, lastItem, work, monthsArray, markersCount)

  return (
    <>
      <div className='border-t-2 mt-60 mb-96 mx-16 relative'>
        <div
          className='relative'
          style={{
            marginLeft: `${leftMonthMargin}%`,
            marginRight: `${rightMonthMargin}%`,
          }}
        >
          <Events
            data={data.events}
            position={eventPointPosition}
            filterString={filterString}
          />
        </div>
        <Markers data={markers} />
      </div>
    </>
  );
}

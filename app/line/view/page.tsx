'use client';
import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
  ReactNode,
  createContext
} from 'react';

// 3D EFFECTS
import { useScroll, useTransform } from 'framer-motion';
import { GeminiEffect } from '@/components/motion/GeminiEffect';
import { positionView } from 'three/examples/jsm/nodes/Nodes.js';

// SHADCN COMPONENTS
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TypographyP } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';

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
import EventLine from '@/components/display/events/EventLine';
import EventList from '@/components/display/events/EventList';
import {EventContext} from '@/app/line/view/eventContext';

export const dynamic = 'force-dynamic';

function SuspenseFallback() {
  return <div>Loading events...</div>;
}



export default function Page() {
  // const ref = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: ref,
  //   offset: ['start start', 'end start'],
  // });

  // const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  // const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  // const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  // const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  // const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  const [form, setForm] = useState({ filter: '' });
  const [activeEvent, setActiveEvent] = useState('');

  const memoisedEventLine = useCallback(
    () => <EventLine filterString={form.filter} />,
    [form.filter]
  );

  const memoisedEventList = useCallback(
    () => <EventList filterString={form.filter} />,
    [form.filter]
  );

  return (
    <div className='bg-black h-lvh flex flex-col'>
      {/* <div
      className='h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-4 overflow-clip'
      ref={ref}
    > */}
      {/* <GeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      /> */}

      {/* <div className='sticky top-5'> */}
      <div className='flex gap-2 justify-between p-4'>
        <Link href={'/line/create'}>
          <Button>Create event</Button>
        </Link>
        <Input
          type='text'
          onChange={(e) => {
            setForm({ ...form, filter: e.target.value });
          }}
          placeholder={'Search events'}
          value={form.filter}
        />
      </div>
      <EventContext.Provider value={{activeEvent, setActiveEvent}}>
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
      </EventContext.Provider>
      {/* </div> */}
    </div>
  );
}

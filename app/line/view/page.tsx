'use client';
import React, {
  useState,
} from 'react';

// 3D EFFECTS
// import { useScroll, useTransform } from 'framer-motion';
// import { GeminiEffect } from '@/components/motion/GeminiEffect';
// import { positionView } from 'three/examples/jsm/nodes/Nodes.js';

// SHADCN COMPONENTS
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// APP COMPONENTS
import { EventContext } from '@/app/line/view/eventContext';
import EventGroup from '@/components/features/events/EventGroup';
import {CreateEventDialog} from '@/components/dialog/CreateEventDialog';

// TYPES
import { EventType } from '@/types/global';

export const dynamic = 'force-dynamic';

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
  const [activeEvent, setActiveEvent] = useState({id: '', event_start_date: ''} as EventType);

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
        <CreateEventDialog />
        <Input
          type='text'
          onChange={(e) => {
            setForm({ ...form, filter: e.target.value });
          }}
          placeholder={'Search events'}
          value={form.filter}
        />
        <Button onClick={(e) => {
            setForm({ ...form, filter: '' });
          }}>X</Button>
      </div>
      <EventContext.Provider value={{ activeEvent, setActiveEvent }}>
        {/* <div className='flex flex-auto gap-2 px-4 overflow-hidden'>
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
        </div> */}
        <EventGroup filterString={form.filter} />
      </EventContext.Provider>
      {/* </div> */}
    </div>
  );
}

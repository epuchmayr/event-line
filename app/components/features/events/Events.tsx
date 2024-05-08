import { useContext } from 'react';

// SHADCN COMPONENTS
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/app/components/ui/card';
import { TypographyP } from '@/app/components/ui/typography';

import { SubObject, EventType } from '@/types/global';

import Tags from './Tags';

import { EventContext } from '@/app/line/view/eventContext';

export default function Events({
  data,
  position,
  filterString,
}: {
  data: EventType[];
  position: string[];
  filterString: string;
}) {
  const { activeEvent, setActiveEvent } = useContext(EventContext);

  return (
    <>
      {data.map((item: EventType, index: number) => {
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

        // check if the current event is active
        const currentEvent = activeEvent === item.id;

        return (
          <div
            key={item.id}
            className={`group absolute hover:z-10 focus-within:z-10 odd:top-8 even:bottom-8 translate-x-[-50%] transition-all duration-300 ease-in-out ${
              isFiltered ? 'z-[1]' : 'z-0'
            }`}
            style={{
              left: `${position[index]}%`,
              opacity: isFiltered ? 1 : 0.1,
              zIndex: currentEvent ? 10 : undefined,
              pointerEvents: isFiltered ? 'auto' : 'none',
            }}
            onPointerEnter={() => setActiveEvent(item.id)}
          >
            <div
              className={`absolute ${
                index % 2 === 0 ? 'top-[-2.5rem]' : 'bottom-[-2.5rem]'
              } left-1/2 translate-x-[-50%]`}
            >
              ⚪
            </div>
            
              <div
                className={`absolute h-14 px-1.5 ${
                  index % 2 === 0 ? 'top-[-1.5rem]' : 'bottom-[-1.5rem]'
                } left-1/2 translate-x-[-50%]`}
              ><div className='h-full border-l-2 border-white'></div>
            </div>
            <Card
              className={`group/card w-[180px] group-hover:w-[350px] focus:w-[350px] transition-all duration-300 ease-in-out scale-75 group-hover:scale-100 focus:scale-100 ${
                isFiltered ? '' : 'scale-50'
              } ${currentEvent ? 'bg-slate-800' : ''}`}
              tabIndex={isFiltered ? 0 : -1}
              onFocus={() => setActiveEvent(item.id)}
            >
              <CardHeader>
                <CardTitle className='truncate'>{item.event_name}</CardTitle>
                <CardDescription className='truncate flex flex-row justify-between'>
                  <span>{item.event_description}</span>
                </CardDescription>
                {/* {item.event_image && (
                  <img src={item.event_image} alt={item.event_name} />
                )} */}
              </CardHeader>
              <CardContent className='truncate hidden group-hover:block group-focus/card:block'>
                {/* <TypographyP>{item.event_content}</TypographyP> */}
                <CardDescription className='mt-5'>
                  <span>{new Date(item.event_start_date).toDateString()}</span>
                </CardDescription>
              </CardContent>
              {/* <CardFooter className='flex justify-between truncate'>
                <p>{item.user_full_name}</p>
                <Tags className='hidden group-hover:block group-focus/card:block' tags={item.event_tags} />
              </CardFooter> */}
            </Card>
          </div>
        );
      })}
    </>
  );
}

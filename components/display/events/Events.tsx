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

import { EventType } from '@/types/global';

import Tags from './Tags';

export default function Events({
  data,
  position,
  filterString,
}: {
  data: EventType[];
  position: string[];
  filterString: string;
}) {
  return (
    <>
      {data.map((item: EventType, index: number) => {
        const isFiltered =
          filterString &&
          !item.event_name.toLowerCase().includes(filterString.toLowerCase());

        return (
          <div
            key={item.id}
            className={`group absolute z-[1] hover:z-10 focus-within:z-10 odd:top-8 even:bottom-8 translate-x-[-50%] transition-all duration-300 ease-in-out`}
            style={{
              left: `${position[index]}%`,
              opacity: isFiltered ? 0.1 : 1,
              zIndex: isFiltered ? 0 : undefined,
              pointerEvents: isFiltered ? 'none' : 'auto',
            }}
          >
            <div
              className={`absolute ${
                index % 2 === 0 ? 'top-[-2.5rem]' : 'bottom-[-2.5rem]'
              } left-1/2 translate-x-[-50%]`}
            >
              ⚪
            </div>
            <div
              className={`absolute h-14 border-l-2 border-white ${
                index % 2 === 0 ? 'top-[-1.5rem]' : 'bottom-[-1.5rem]'
              } left-1/2 translate-x-[-50%]`}
            ></div>
            <Card
              className='group/card w-[180px] group-hover:w-[350px] focus:w-[350px] transition-all duration-300 ease-in-out scale-75 group-hover:scale-100 focus:scale-100'
              style={{ transform: `scale(${isFiltered ? 0.5 : 0.75})` }}
              tabIndex={isFiltered ? -1 : 0}
            >
              <CardHeader>
                <CardTitle className='truncate'>{item.event_name}</CardTitle>
                <CardDescription className='truncate flex flex-row justify-between'>
                  <span>{item.event_description}</span>
                  <span>{new Date(item.event_start_date).toDateString()}</span>
                </CardDescription>
                {/* {item.event_image && (
                  <img src={item.event_image} alt={item.event_name} />
                )} */}
              </CardHeader>
              <CardContent className='hidden group-hover:block group-focus/card:block'>
                <TypographyP>{item.event_content}</TypographyP>
              </CardContent>
              <CardFooter className='flex justify-between truncate'>
                {/* <p>{item.user_full_name}</p> */}
                <Tags tags={item.event_tags} />
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </>
  );
}

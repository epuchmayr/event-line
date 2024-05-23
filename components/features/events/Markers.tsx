






import { MarkerType } from '@/types/global'


export default function Markers ({ data }: { data: MarkerType[] }) {
  return (
    <>
      {data.map((item: MarkerType, index: number) => {
        return (
          <div
            key={item.name}
            className={`group absolute bottom-48 translate-x-[-50%] transition-all duration-300 ease-in-out`}
            style={{ left: `${item.position}%` }}
          >
            <div
              className={`absolute h-48 border-l-2 border-white top-full left-1/2 translate-x-[-50%]`}
            ></div>
            <div className='border border-white px-2'>{item.name}</div>
          </div>
        );
      })}
    </>
  );
};
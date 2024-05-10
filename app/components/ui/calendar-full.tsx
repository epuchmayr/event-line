import React, { useState } from 'react';
import Calendar from 'react-lightweight-calendar';

import './CalendarCustomStyles.css';

const CalendarFull = ({
  data = [],
  currentView = 'MONTH',
  onItemClick,
  currentDate,
  setCurrentDate,
}: {
  data: Record<string, any>[] | undefined;
  currentView?: 'DAY' | 'WEEK_TIME' | 'MONTH';
  onItemClick?: Function;
  currentDate: string;
  setCurrentDate: Function;
}) => {
  // const [currentDate, setCurrentDate] = useState<string>(`${new Date()}`);
  return (
    <Calendar
      data={data}
      currentView={currentView}
      currentDate={currentDate}
      setCurrentDate={(date: string | Date) => setCurrentDate(date.toString())}
      activeTimeDateField='startTime-endTime' // Or just startTime or just endTime
      weekStartsOn={0} // Monday
      // If you want additional customization, uncomment the code and make the appropriate changes
      // renderItem={(data, isHovered) => {
      // // Custom rendering of event element
      // console.log(data, isHovered);
      // return (
      // <>
      // <div>{data.title}</div>
      // <div>{data.id}</div>
      // </>
      // )
      // }}
      // renderItemText={(data) => {
      // // Custom rendering of event element text
      // return <p>{data.title}</p>;
      // }}
      // renderHeaderItem={(data, extras) => {
      // // Custom rendering of header element
      // return <div>{data.startTime}-{date.endTime}</div>;
      // }}
      // renderHeaderItemText={(data) => {
      // // Custom rendering of header element text
      // return <p>{data.title}</p>;
      // }}
      // disableHoverEffect={true}
      colorDots={
        [
          {
            color: 'green',
            text: 'Busy day',
            date: '2024-05-02',
          },
        ]
      }
      timeDateFormat={
        {
          // day: 'EEEE',
          // hour: 'hh a',
          // monthYear: 'LLLL yyyy',
        }
      }
      onDayNumberClick={(day) => {
        // Handle day number click
        console.log(day);
      }}
      onDayStringClick={(day) => {
        // Handle day text click
        console.log(day);
      }}
      onHourClick={(value) => {
        // Handle hour click
        console.log(value);
      }}
      onColorDotClick={(value) => {
        // Handle color dot click
        console.log(value);
      }}
      onItemClick={(item) => {
        // Handle event item click
        onItemClick && onItemClick({id: item!.id, event_start_time: item!.startTime, event_end_time: item!.endTime, event_name: item!.title});
      }}
      onCellClick={(value) => {
        // Handle cell click
        console.log(value);
      }}
      // cellDisplayMode={{
      //   WEEK_TIME: {
      //     inactiveCells: ['2023-05-29'],
      //     state: 'CUSTOM',
      //   },
      // }}
    />
  );
};

export default CalendarFull;

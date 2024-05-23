import PropTypes from 'prop-types';
// import classNames from "classnames";

import clsx from 'clsx';
import styles from './YearCal.module.css';

import {
  seasonsOfYear,
  monthsOfYear,
  createMonthsForCurrentYear,
  // createDaysForNextMonth,
  // createDaysForPreviousMonth,
  isWeekendDay,
  getMonthDropdownOptions,
  getYearDropdownOptions,
  getToday,
  getDateArray,
  isCurrentDate,
  isSelectedMonth,
  DayObjectType,
} from './helpers';

import dayjs from 'dayjs';
import { Button } from '../../ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../../ui/select';
import { EventType } from '@/types/global';

// Calendar.propTypes = {
//   className: PropTypes.string,
//   yearMonthDay: PropTypes.arrayOf(PropTypes.number).isRequired, // e.g. [2021, 6] for June 2021
//   onYearMonthDayChange: PropTypes.func.isRequired,
//   renderDay: PropTypes.func,
//   data: PropTypes.array,
// };

export default function Calendar({
  className = '',
  yearMonthDay = [2021, 6, 1],
  onYearMonthDayChange,
  renderDay = () => null,
  data = [],
  handleEventClick,
  selectedDate,
  activeEvent,
}: {
  className?: string;
  yearMonthDay?: number[];
  onYearMonthDayChange: (yearAndMonth: number[]) => void;
  renderDay?: Function;
  data?: any[];
  handleEventClick: Function;
  selectedDate: string;
  activeEvent: EventType
}) {
  const [year, month, day] = yearMonthDay;

  // sort event data into year and month
  const sortedEventData = data.reduce((acc, curr) => {
    const itemDateString = dayjs(curr.event_start_date);
    const itemYear = itemDateString.year().toString();
    const itemMonth = itemDateString.month().toString();
    const itemDate = itemDateString.date().toString();
    // console.log('itemDateString', acc, itemYear, itemMonth);
    if (!acc[itemYear]) {
      acc[itemYear] = [];
    }
    if (!acc[itemYear][itemMonth]) {
      acc[itemYear][itemMonth] = [];
    }
    if (!acc[itemYear][itemMonth][itemDate]) {
      acc[itemYear][itemMonth][itemDate] = [];
    }
    acc[itemYear][itemMonth][itemDate].push(curr);
    return acc;
  }, {});

  const currentMonthEvents = sortedEventData[year] || [];
  // console.log('data', year, month, currentMonthEvents);
  // console.log([
  //   sortedEventData[year]?.[month - 2],
  //   sortedEventData[year]?.[month - 1],
  //   sortedEventData[year]?.[month],
  // ]);

  const currentYearViewEvents = [
    sortedEventData[year]?.[month - 2],
    sortedEventData[year]?.[month - 1],
    sortedEventData[year]?.[month],
  ];

  let currentYearMonths = createMonthsForCurrentYear(year, month);
  // let previousMonthDays = createDaysForPreviousMonth(
  //   year,
  //   month,
  //   currentMonthDays
  // );
  // let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
  let calendarGridDayObjects = [
    // ...previousMonthDays,
    ...currentYearMonths,
    // ...nextMonthDays,
  ];

  const today = getToday();
  const [currentYear, currentMonth, currentDate] = getDateArray(today);

  const handleTodayNavButtonClick = () => {
    // current Month is zero indexed
    onYearMonthDayChange([currentYear, currentMonth + 1]);
  };

  const handleYearNavBackButtonClick = () => {
    let nextYear = year-1;
    let nextMonth = month;
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  const handleYearNavForwardButtonClick = () => {
    let nextYear = year + 1;
    let nextMonth = month;
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  // const handleMonthSelect = (value: string) => {
  //   let nextYear = year;
  //   let nextMonth = +value;
  //   onYearMonthDayChange([nextYear, nextMonth]);
  // };

  const handleYearSelect = (value: string) => {
    let nextMonth = month;
    let nextYear = +value;
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  // console.log(today, getDate(today), getMonth(today))

  return (
    <div className={clsx(styles['calendar-root'], className)}>
      <div className='navigation-header'>
        <div className={styles['calendar-nav']}>
          <Button onClick={handleYearNavBackButtonClick}>{`<`} Prev</Button>
          <Select value={year.toString()} onValueChange={handleYearSelect}>
          <Button onClick={handleTodayNavButtonClick}>Today</Button>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select privacy' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getYearDropdownOptions(year).map(({ label, value }) => (
                  <SelectItem value={value.toString()} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleYearNavForwardButtonClick}>Next {`>`}</Button>
        </div>
      </div>
      <div className={styles['seasons-of-year']}>
        {seasonsOfYear.map((day, index) => (
          <div
            key={day}
            className={clsx(styles['seasons-of-year-header-cell'])}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles['months-of-year']}>
        {monthsOfYear.map((day, index) => (
          <div key={day} className={clsx(styles['months-of-year-header-cell'])}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles['months-grid']}>
        {calendarGridDayObjects.map((day: DayObjectType) => {
          // console.log('day', currentDate === day.dayOfMonth && currentMonth === dayjs(day.dateString).month())

          // console.log('day', day, calendarGridDayObjects, sortedEventData[2024]);

          return (
            <div
              key={day.dateString}
              className={clsx(
                styles['month-grid-item-container'],
                // isWeekendDay(day.dateString) && styles['weekend-day'],
                day.isCurrentYear && styles['current-year']
              )}
              // onClick={() => console.log('day clicked', day)}
            >
              <div
                className={clsx(
                  styles['month-content-wrapper'],
                  // isCurrentDate(day) && styles['today-content-wrapper'],
                  isSelectedMonth(day, selectedDate) &&
                    styles['selected-content-wrapper']
                )}
              >
                {renderDay(day)}
                {day.isCurrentYear &&
                  sortedEventData[year] &&
                  !!sortedEventData[year][day.monthOfYear] && (
                    <CalendarMonthContent
                      day={day}
                      events={sortedEventData[year][`${day.monthOfYear}`]}
                      handleEventClick={handleEventClick}
                      activeId={activeEvent.id}
                    />
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CalendarMonthHeader.propTypes = {
  calendarDayObject: PropTypes.object.isRequired,
};

export function CalendarMonthHeader({
  calendarDayObject,
}: {
  calendarDayObject: DayObjectType;
}) {
  // console.log('calendarDayObject', calendarDayObject)

  return (
    <div className={styles['month-grid-item-header']}>
      <span>{calendarDayObject.monthOfYear}</span>
    </div>
  );
}

const CalendarMonthContent = ({
  day,
  events,
  handleEventClick,
  relativeMonth = 'current',
  activeId,
}: {
  day: any;
  events: any[];
  handleEventClick: Function;
  relativeMonth?: string;
  activeId?: string;
}) => {
  const eventCount = events.reduce((acc, curr) => acc + curr.length, 0);
  // console.log('events test', events, events.reduce((acc, curr) => acc + curr.length, 0))
  
  const singleList = events.reduce((acc, curr) => {
    if (curr.length) 
      acc = [...acc, ...curr]
    return acc
  }, [])
  

  return (
    <div className={clsx(styles[relativeMonth], styles['event-item-wrapper'])}>
      <div className={styles['month-grid-item-header']}>{eventCount}</div>
      {singleList.map((event: EventType) => {
  console.log(event.id === activeId)
        return (
        <div
          onClick={() => handleEventClick(event)}
          key={event.id}
          className={clsx(
            styles['event-item'],
            event.isFiltered && styles['filtered'],
            (event.id === activeId) && styles['active-event']
          )}
        >
      {/* test {JSON.stringify(event[0].event_name)} */}
          {event.event_name ?? null}
        </div>
      )})}
    </div>
  );
};

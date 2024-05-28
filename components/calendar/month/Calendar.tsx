import PropTypes from 'prop-types';
// import classNames from "classnames";

import clsx from 'clsx';
import styles from './Calendar.module.css';

import {
  daysOfWeek,
  createDaysForCurrentMonth,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  isWeekendDay,
  getMonthDropdownOptions,
  getYearDropdownOptions,
  getToday,
  getDateArray,
  isCurrentDate,
  isSelectedDate,
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
import { EventType, FilteredEventType } from '@/types/global';

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

  const currentMonthViewEvents = [
    sortedEventData[year]?.[month - 2],
    sortedEventData[year]?.[month - 1],
    sortedEventData[year]?.[month],
  ];

  let currentMonthDays = createDaysForCurrentMonth(year, month);
  let previousMonthDays = createDaysForPreviousMonth(
    year,
    month,
    currentMonthDays
  );
  let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
  let calendarGridDayObjects = [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays,
  ];

  const today = getToday();
  const [currentYear, currentMonth, currentDate] = getDateArray(today);

  const handleTodayNavButtonClick = () => {
    // current Month is zero indexed
    onYearMonthDayChange([currentYear, currentMonth + 1]);
  };

  const handleMonthNavBackButtonClick = () => {
    let nextYear = year;
    let nextMonth = month - 1;
    if (nextMonth === 0) {
      nextMonth = 12;
      nextYear = year - 1;
    }
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  const handleMonthNavForwardButtonClick = () => {
    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear = year + 1;
    }
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  const handleMonthSelect = (value: string) => {
    let nextYear = year;
    let nextMonth = +value;
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  const handleYearSelect = (value: string) => {
    let nextMonth = month;
    let nextYear = +value;
    onYearMonthDayChange([nextYear, nextMonth]);
  };

  return (
    <div className={clsx(styles['calendar-root'], className)}>
      <div className='navigation-header'>
        <div className={styles['calendar-nav']}>
          <Button onClick={handleMonthNavBackButtonClick}>{`<`} Prev</Button>
          <Button onClick={handleTodayNavButtonClick}>Today</Button>
          <Button onClick={handleMonthNavForwardButtonClick}>Next {`>`}</Button>

          <Select value={month.toString()} onValueChange={handleMonthSelect}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select privacy' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getMonthDropdownOptions().map(({ label, value }) => (
                  <SelectItem value={value.toString()} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={handleYearSelect}>
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
        </div>
      </div>
      <div className={styles['days-of-week']}>
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={clsx(
              styles['day-of-week-header-cell'],
              [6, 0].includes(index) && styles['weekend-day']
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles['days-grid']}>
        {calendarGridDayObjects.map((day: DayObjectType) => {

          return (
            <div
              key={day.dateString}
              className={clsx(
                styles['day-grid-item-container'],
                isWeekendDay(day.dateString) && styles['weekend-day'],
                day.isCurrentMonth && styles['current-month']
              )}
            >
              <div
                className={clsx(
                  styles['day-content-wrapper'],
                  isCurrentDate(day) && styles['today-content-wrapper'],
                  isSelectedDate(day, selectedDate) &&
                    styles['selected-content-wrapper']
                )}
              >
                {renderDay(day)}
                {day.isPreviousMonth &&
                  currentMonthViewEvents[0] &&
                  !!currentMonthViewEvents[0][day.dayOfMonth] && (
                    <CalendarDayContent
                      relativeMonth='previous'
                      day={day}
                      events={currentMonthViewEvents[0][day.dayOfMonth]}
                      handleEventClick={handleEventClick}
                      activeId={activeEvent.id}
                    />
                  )}
                {day.isCurrentMonth &&
                  currentMonthViewEvents[1] &&
                  !!currentMonthViewEvents[1][day.dayOfMonth] && (
                    <CalendarDayContent
                      day={day}
                      events={currentMonthViewEvents[1][day.dayOfMonth]}
                      handleEventClick={handleEventClick}
                      activeId={activeEvent.id}
                    />
                  )}
                {day.isNextMonth &&
                  currentMonthViewEvents[2] &&
                  !!currentMonthViewEvents[2][day.dayOfMonth] && (
                    <CalendarDayContent
                      relativeMonth='next'
                      day={day}
                      events={currentMonthViewEvents[2][day.dayOfMonth]}
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

CalendarDayHeader.propTypes = {
  calendarDayObject: PropTypes.object.isRequired,
};

export function CalendarDayHeader({
  calendarDayObject,
}: {
  calendarDayObject: DayObjectType;
}) {
  return (
    <div className={styles['day-grid-item-header']}>
      <span>{calendarDayObject.dayOfMonth}</span>
    </div>
  );
}

const CalendarDayContent = ({
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
  return (
    <div className={clsx(styles[relativeMonth], styles['event-item-wrapper'])}>
      {events.map((event: FilteredEventType) => (
        <div
          onClick={() => handleEventClick(event)}
          key={event.id}
          className={clsx(
            styles['event-item'],
            event.isFiltered && styles['filtered'],
            (event.id === activeId) && styles['active-event']
          )}
        >
          {event.event_name ?? null}
        </div>
      ))}
    </div>
  );
};

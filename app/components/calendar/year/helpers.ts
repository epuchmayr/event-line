import { range } from 'ramda';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { boolean, number, string } from 'zod';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export const seasonsOfYear = ['Winter', 'Spring', 'Summer', 'Fall'];
export const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface DayObjectType {
  dateString: string; // e.g. 2021-08-30
  monthOfYear: number; // e.g. 30
  isCurrentYear: boolean; // true/false
  isNextMonth?: boolean; // true/false
  isPreviousMonth?: boolean; // true/false,
}

export function getYearDropdownOptions(currentYear: number) {
  let minYear = currentYear - 4;
  let maxYear = currentYear + 5;
  return range(minYear, maxYear + 1).map((y) => ({ label: `${y}`, value: y }));
}

export function getMonthDropdownOptions() {
  return range(1, 13).map((m) => ({
    value: m,
    label: dayjs()
      .month(m - 1)
      .format('MMMM'),
  }));
}

export function getNumberOfDaysInMonth(year: number, month: number) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

export function createMonthsForCurrentYear(year: number, month: number) {
  return [...Array(12)].map((_, index) => {
    return {
      dateString: dayjs(`${year}-${index + 1}-01`).format('YYYY-MM-DD'),
      monthOfYear: index,
      isCurrentYear: true,
    };
  });
}

// export function createDaysForPreviousMonth(
//   year: number,
//   month: number,
//   currentMonthDays: {
//     dateString: string;
//     dayOfMonth: number;
//     isCurrentMonth: boolean;
//   }[]
// ) {
//   const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].dateString);
//   const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

//   const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;

//   const previousMonthLastMondayDayOfMonth = dayjs(
//     currentMonthDays[0].dateString
//   )
//     .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
//     .date();

//   return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((_, index) => {
//     return {
//       dateString: dayjs(
//         `${previousMonth.year()}-${previousMonth.month() + 1}-${
//           previousMonthLastMondayDayOfMonth + index
//         }`
//       ).format('YYYY-MM-DD'),
//       dayOfMonth: previousMonthLastMondayDayOfMonth + index,
//       isCurrentMonth: false,
//       isPreviousMonth: true,
//     };
//   });
// }

// export function createDaysForNextMonth(
//   year: number,
//   month: number,
//   currentMonthDays: {
//     dateString: string;
//     dayOfMonth: number;
//     isCurrentMonth: boolean;
//   }[]
// ) {
//   const lastDayOfTheMonthWeekday = getWeekday(
//     `${year}-${month}-${currentMonthDays.length}`
//   );
//   const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
//   const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;

//   return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
//     return {
//       dateString: dayjs(
//         `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
//       ).format('YYYY-MM-DD'),
//       dayOfMonth: index + 1,
//       isCurrentMonth: false,
//       isNextMonth: true,
//     };
//   });
// }

export function getToday() {
  return dayjs().toDate();
}
export function getDateArray(dateString: Date) {
  return [
    dayjs(dateString).year(),
    dayjs(dateString).month(),
    dayjs(dateString).date(),
  ];
}

export function isCurrentDate(day: DayObjectType) {
  const today = getToday();
  const [year, month, date] = getDateArray(today);
  return (
    year === dayjs(day.dateString).year() &&
    month === dayjs(day.dateString).month() &&
    date === day.monthOfYear
  );
}

export function isSelectedDate(day: DayObjectType, selectedDate: string) {
  // const selectedDate = dayjs().toDate();
  return dayjs(day.dateString).isSame(selectedDate, 'day');
}

export function isSelectedMonth(day: DayObjectType, selectedDate: string) {
  // const selectedDate = dayjs().toDate();
  return dayjs(day.dateString).isSame(selectedDate, 'month');
}

// sunday === 0, saturday === 6
export function getWeekday(dateString: string) {
  return dayjs(dateString).weekday();
}

export function isWeekendDay(dateString: string) {
  return [6, 0].includes(getWeekday(dateString));
}

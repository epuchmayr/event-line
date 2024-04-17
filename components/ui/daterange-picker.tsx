'use client';

import * as React from 'react';
import { addDays, format, addHours } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';

import { DayPicker } from "react-day-picker"

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ControllerProps, ControllerRenderProps } from 'react-hook-form';

export function DatePickerWithRange({
  className,
  value,
  onChange
}: // }: React.HTMLAttributes<HTMLDivElement>) {
{
  className?: string;
  value: {from: Date, to: Date};
  onChange: SelectRangeEventHandler;
}) {

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

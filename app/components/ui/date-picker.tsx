'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/features/ui/button';
import { Calendar } from '@/features/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/features/ui/popover';
import {
  ControllerProps,
  ControllerRenderProps,
  Controller,
} from 'react-hook-form';
import { Matcher, SelectSingleEventHandler } from 'react-day-picker';

export function DatePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: SelectSingleEventHandler;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

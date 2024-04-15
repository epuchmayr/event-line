'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';

import dayjs, { Dayjs } from 'dayjs';

import TagAutocomplete from '@/components/form/create-event/TagAutocomplete';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql, useMutation } from '@apollo/client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { DateTimePicker, TimePicker } from '@/components/ui/datetime-picker';
import { Granularity } from '@react-types/datepicker';

import dynamic from 'next/dynamic';

// dayjs datePicker and timePicker setup
// const currentDate = dayjs();
const currentDate = new Date();
currentDate.setDate(currentDate.getHours() + 1);
const rangeDate = currentDate;
// const rangeDate = currentDate.add(1, 'day');
// const currentHour = currentDate;
// const rangeHour = currentDate.add(1, 'hour');

console.log('currentDate', currentDate, rangeDate);

const OPTIONS: Option[] = [
  { label: 'Event', value: 'event' },
  { label: 'Personal', value: 'personal' },
  { label: 'Family', value: 'family' },
  { label: 'Friends', value: 'friends' },
  { label: 'Travel', value: 'travel' },
  { label: 'Household', value: 'household' },
  { label: 'Garden', value: 'garden' },
];

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  event_name: z
    .string()
    .min(1, {
      message: 'Event name must be at least 1 character.',
    })
    .max(160, {
      message: 'Event name must not be longer than 160 characters.',
    }),
  event_description: z
    .string()
    .max(1024, {
      message: 'Event description must not be longer than 1024 characters.',
    })
    .optional(),
  event_content: z
    .string()
    .max(4096, {
      message: 'Event content must not be longer than 4096 characters.',
    })
    .optional(),
  event_tags: z
    .array(optionSchema)
    .min(1, { message: 'Please select at least one tag.' }),
  event_privacy: z.enum(['visible', 'hidden']),
  event_start_date: z.date().nullable(),
  event_end_date: z.date().optional(),
  event_start_time: z.date(),
  event_end_time: z.date().optional(),
});

export default function CreateForm({ handleSubmit }) {
  const [formState, setFormState] = React.useState({
    showDateRange: false,
    granularity: 'day' as Granularity,
    showTime: false,
    showTimeRange: false,
    privacy: 'visible',
  });

  // console.log('formState', formState);

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.name, event.target.checked);
  };

  const updateValue = (key: string, value: string | boolean) => {
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      event_name: '',
      event_tags: [{ label: 'Event', value: 'event' }],
      event_privacy: 'visible',
      event_start_date: currentDate,
      event_end_date: rangeDate,
    },
  });

  // test form return
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('submit', JSON.stringify(values, null, 2));
  }

  return (
    <Card className='w-[600px]'>
      <Image
        className='h-20 w-full object-cover rounded-t-lg'
        src={'/images/intergalactic_loom.png'}
        alt='intergalactic loom'
        width={640}
        height={640}
        priority
      />
      <CardHeader>
        <CardTitle>Create a moment</CardTitle>
        <CardDescription>
          {/* {selectedDate.format('YYYY-MM-DD').toString()} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='event_name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput label='Event name *' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='event_description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput label='Event description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='event_content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='for a more detailed explanation'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name='event_start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        label='event start date'
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                        // toggle day to minute
                        granularity={formState.granularity}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='event_end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>
                    <DateTimePicker
                      label='event end date'
                      jsDate={field.value}
                      onJsDateChange={field.onChange}
                      granularity={formState.granularity}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel className='text-base'>Set Time</FormLabel>
                <div className='flex flex-row items-center justify-between rounded-lg border py-2 px-4'>
                <Switch
                  checked={formState.showTime}
                  onCheckedChange={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showTime: !prev.showTime,
                      granularity: prev.showTime
                        ? ('day' as Granularity)
                        : ('minute' as Granularity),
                    }))
                  }
                /></div>
              </FormItem>
            </div>
            {/* <div className='flex'>
              <FormField
                control={form.control}
                name='event_start_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start time</FormLabel>
                    <TimePicker
                      label='event start time'
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='event_end_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <TimePicker
                      label='event end time'
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
            {/* <Stack direction='row' spacing={1}>
          <MobileDatePicker
            label='Date'
            name='event_start_date'
            defaultValue={selectedDate}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formState.showDateRange}
                onChange={handleChangeCheck}
                name='showDateRange'
              />
            }
            label='Date Range'
          />
        </Stack>
        <Collapse in={formState.showDateRange} timeout={200}>
          <MobileDatePicker
            label='End date'
            name='event_end_date'
            disabled={!formState.showDateRange}
            defaultValue={rangeDate}
          />
        </Collapse>
        <FormControlLabel
          control={
            <Switch
              checked={formState.showTime}
              onChange={handleChangeCheck}
              name='showTime'
            />
          }
          label='Time'
        />

        <Collapse in={formState.showTime} timeout={200}>
          <Stack direction='row' spacing={1}>
            <MobileTimePicker
              label='Time'
              name='event_start_time'
              disabled={!formState.showTime}
              defaultValue={currentHour}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formState.showTimeRange}
                  onChange={handleChangeCheck}
                  name='showTimeRange'
                  disabled={!formState.showTime}
                />
              }
              label='Time Range'
            />
          </Stack>
          <Collapse
            in={formState.showTimeRange}
            timeout={200}
            sx={{ mt: 1 }}
          >
            <MobileTimePicker
              disabled={!formState.showTime || !formState.showTimeRange}
              label='End time'
              name='event_end_time'
              defaultValue={rangeHour}
            />
          </Collapse>
        </Collapse> */}
            {/* <Textarea
              id='outlined-multiline-description'
              name='event_description'
              placeholder='What is it about'
            />
            <Textarea
              id='outlined-multiline-content'
              name='event_content'
              placeholder='What happened'
            /> */}
            {/* <TagAutocomplete /> */}
            {/* <FormControl fullWidth>
          <InputLabel id='visibility-select-label'>Privacy</InputLabel>
          <Select
            labelId='visibility-select-label'
            id='visibility-select'
            value={formState.privacy}
            label='Privacy'
            name='event_privacy'
            onChange={handleChangeSelect}
          >
            <MenuItem value={'visible'}>Visible</MenuItem>
            <MenuItem value={'hidden'}>Hidden</MenuItem>
          </Select>
        </FormControl> */}{' '}
            <FormField
              control={form.control}
              name='event_tags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={field.value}
                      onChange={field.onChange}
                      defaultOptions={OPTIONS}
                      placeholder='Search or add new tags...'
                      creatable
                      emptyIndicator={
                        <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                          no results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='event_privacy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select privacy' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='visible'>Visible</SelectItem>
                        <SelectItem value='hidden'>Hidden</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className='my-4' />
            <FormItem>
              <Button className='w-full' type='submit'>
                Create
              </Button>
            </FormItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

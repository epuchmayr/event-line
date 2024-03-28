'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Button,
  TextField,
  Box,
  Stack,
  Switch,
  FormControlLabel,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';

import { SelectChangeEvent } from '@mui/material';
import TagAutocomplete from '@/components/form/create-event/TagAutocomplete';
import { useUser } from '@clerk/nextjs';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql, useMutation } from '@apollo/client';

// dayjs datePicker and timePicker setup
const currentDate = dayjs();
const rangeDate = currentDate.add(1, 'day');
const currentHour = currentDate;
const rangeHour = currentDate.add(1, 'hour');

type Event = {
  id: string;
  name: string;
  content: string;
  author: string;
};
const ADD_EVENT = gql`
  mutation (
    $event_name: String!
    $event_start_date: String!
    $event_end_date: String!
    $event_start_time: String!
    $event_end_time: String!
    $event_description: String!
    $event_content: String!
    $event_tags: String!
    $event_privacy: String!
    $user_id: String!
    $user_full_name: String!
  ) {
    insert_events(
      event_name: $event_name
      event_start_date: $event_start_date
      event_end_date: $event_end_date
      event_start_time: $event_start_time
      event_end_time: $event_end_time
      event_description: $event_description
      event_content: $event_content
      event_tags: $event_tags
      event_privacy: $event_privacy
      user_id: $user_id
      user_full_name: $user_full_name
    ) {
      returning {
        id
        event_name
        event_start_date
        event_end_date
        event_start_time
        event_end_time
        event_description
        event_content
        event_tags
        event_privacy
        user_id
        user_full_name
      }
    }
  }
`;

export default function Page() {
  const { user } = useUser();
  const userId = user?.id.toString();
  const userFullName = user?.fullName?.toString();

  const [formState, setFormState] = React.useState({
    showDateRange: false,
    showTime: false,
    showTimeRange: false,
    privacy: 'visible',
  });

  const [addEvent] = useMutation(ADD_EVENT);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(currentDate);

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.name, event.target.checked);
  };
  const handleChangeSelect = (event: SelectChangeEvent<string>) => {
    updateValue(event.target.name, event.target.value);
  };
  const updateValue = (key: string, value: string | boolean) => {
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    addEvent({
      variables: {
        event_name: formData.get('event_name') as string,
        event_start_date: formData.get('event_start_date') as string,
        event_end_date: formData.get('event_end_date') as string,
        event_start_time: formData.get('event_start_time') as string,
        event_end_time: formData.get('event_end_time') as string,
        event_description: formData.get('event_description') as string,
        event_content: formData.get('event_content') as string,
        event_tags: formData.get('event_tags') as string,
        event_privacy: formData.get('event_privacy') as string,
        user_id: formData.get('user_id') as string,
        user_full_name: formData.get('user_full_name') as string,
      },
    });
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card sx={{ maxWidth: 600 }}>
        <CardMedia
          component='img'
          height='140'
          image='/images/intergalactic_loom.png'
          alt='intergalactic loom'
        />
        <CardHeader
          title='Create a moment'
          subheader={selectedDate.format('YYYY-MM-DD').toString()}
        />
        <CardContent>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              '& > :not(style)': { mb: 2, width: '100%' },
            }}
          >
            <input type='hidden' name='user_id' value={userId} />
            <input type='hidden' name='user_full_name' value={userFullName} />
            <TextField
              required
              id='outlined-required'
              label='Event name'
              name='event_name'
            />
            <Stack direction='row' spacing={1}>
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
            </Collapse>

            <TextField
              id='outlined-multiline-description'
              label='Description'
              name='event_description'
              multiline
              minRows={1}
              maxRows={2}
              placeholder='What is it about'
            />
            <TextField
              id='outlined-multiline-content'
              label='Content'
              name='event_content'
              multiline
              minRows={4}
              maxRows={8}
              placeholder='What happened'
            />
            <TagAutocomplete />

            <FormControl fullWidth>
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
                {/* <MenuItem value={'custom'}>Custom</MenuItem> */}
              </Select>
            </FormControl>

            {/* <Typography variant='body2' color='text.secondary'></Typography> */}

            <Stack spacing={2} mt={2} direction='row'>
              <Button variant='contained' type='submit' fullWidth>
                Create
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

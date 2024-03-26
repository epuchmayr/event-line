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

const currentDate = dayjs();
const rangeDate = currentDate.add(1, 'day');
const currentHour = currentDate;
const rangeHour = currentDate.add(1, 'hour');

export default function Page() {
  const [formState, setFormState] = React.useState({
    showDateRange: false,
    showTime: false,
    showTimeRange: false,
    privacy: 'visible',
  });

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
    const data = new FormData(event.currentTarget);
    // console.log({
    //   data: data.keys(),
    // });
    // for (const pair of data.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card sx={{ maxWidth: 600 }}>
        <CardMedia
          component='img'
          alt='green iguana'
          height='140'
          image='/images/contemplative-reptile.jpg'
        />
        <CardHeader
          title='Create a moment'
          subheader={selectedDate.format('YYYY-MM-DD').toString()}
        />
        <CardContent>
          {/* <Typography gutterBottom variant='h5' component='div'></Typography> */}
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              '& > :not(style)': { mb: 2, width: '100%' },
            }}
          >
            <TextField
              required
              id='outlined-required'
              label='Event name'
              name='name'
            />
            <Stack direction='row' spacing={1}>
              <MobileDatePicker
                label='Date'
                name='startDate'
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
                name='endDate'
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
                  name='startTime'
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
                  name='endTime'
                  defaultValue={rangeHour}
                />
              </Collapse>
            </Collapse>

            <TextField
              id='outlined-multiline-static'
              label='Description'
              name='description'
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
                name='privacy'
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

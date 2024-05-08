import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { RootState } from '@/lib/store';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [{
      id: '1',
      event_name: 'Event Slice',
      event_content: 'event_content',
      event_description: 'event_description',
      event_image: 'event_image',
      event_start_date: 'event_start_date',
      event_end_date: 'event_end_date',
      event_range_date: 'event_range_date',
      event_start_time: 'event_start_time',
      event_end_time: 'event_end_time',
      event_tags: 'event_tags',
      event_privacy: 'event_privacy',
      user_id: 'user_id',
      user_full_name: 'user_full_name'
    }],
  },
  reducers: {
    initializeEvents: (state, payload) => {
      state
    },
    addEvent: (state) => {
      state;
    },
    removeEvent: (state) => {
      state;
    },
  },
});

export const { initializeEvents, addEvent, removeEvent } = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events

export default eventsSlice.reducer;

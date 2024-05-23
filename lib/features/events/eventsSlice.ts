import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { RootState } from '@/lib/store';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { Events as query } from '@/app/components/features/events/Events.graphql';
import { EventType, SubObject } from '@/types/global';

// import { getClient } from '@/lib/ApolloClient';

// const { data } = await getClient().query({ query: query });
const initialState = {
  events: [{
    id: '1',
    event_name: 'Event Slice',
    event_content: 'event_content',
    event_description: 'event_description',
    event_image: 'event_image',
    event_start_date: '2024-04-17T21:27:36.144+00:00',
    event_end_date: 'event_end_date',
    event_range_date: 'event_range_date',
    event_start_time: '2024-04-17T21:27:36.144+00:00',
    event_end_time: 'event_end_time',
    event_tags: 'event_tags',
    event_privacy: 'event_privacy',
    user_id: 'user_id',
    user_full_name: 'user_full_name'
  }],
  loading: false,
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    initializeEvents: (state, { payload }: { payload: typeof state.events[0] }) => {
      console.log('loading? ', state.loading)
      if (!payload || state.loading) return state
      
      return {...state,
        events: [
          ...state.events,
          payload
        ]
      };
    },
    addEvent: (state) => {
      state;
    },
    removeEvent: (state) => {
      state;
    },
    loadEvents: (state, {payload}) => {
      console.log('loadEvents', payload)
      return payload
    },
  },
});




export const { initializeEvents, addEvent, removeEvent, loadEvents } = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events

export default eventsSlice.reducer;

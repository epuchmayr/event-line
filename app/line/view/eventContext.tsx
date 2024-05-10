import {
  createContext
} from 'react';

import { EventType } from '@/types/global';

export const EventContext = createContext({activeEvent: {id: '', event_start_date: ''}, setActiveEvent: (event: EventType) => {}});
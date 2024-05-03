import {
  createContext
} from 'react';

export const EventContext = createContext({activeEvent: '', setActiveEvent: (event: string) => {}});
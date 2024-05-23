import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './features/events/eventsSlice';

import { setupListeners } from '@reduxjs/toolkit/query'
import { pokemonApi } from '@/services/events'

export const makeStore = () => {
  return configureStore({
    reducer: {
      events: eventsReducer,
      // Add the generated reducer as a specific top-level slice
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

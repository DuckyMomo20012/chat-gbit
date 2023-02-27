import { configureStore } from '@reduxjs/toolkit';
import convoReducer from './slice/convoSlice';

export const store = configureStore({
  reducer: {
    convo: convoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

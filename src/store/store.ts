import { configureStore } from '@reduxjs/toolkit';
import convoReducer from './slice/convoSlice';
import modelReducer from './slice/modelSlice';

export const store = configureStore({
  reducer: {
    convo: convoReducer,
    model: modelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

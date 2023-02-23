import { createSlice } from '@reduxjs/toolkit';

export type CounterState = {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    skipTo: (state, action) => {
      const { payload } = action;
      state.value = payload;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, skipTo, reset } = counterSlice.actions;

export default counterSlice.reducer;

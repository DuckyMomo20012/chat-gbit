import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TModel = {
  name: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
  price: number;
};

export const MODEL: Array<TModel> = [
  {
    name: 'gpt-3.5-turbo',
    price: 0.0005,
  },
  {
    name: 'gpt-3.5-turbo-0301',
    price: 0.0005,
  },
];

const initialState = MODEL.find((m) => m.name === 'gpt-3.5-turbo');

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setModel(state, action: PayloadAction<TModel['name']>) {
      return MODEL.find((m) => m.name === action.payload);
    },
  },
});

export const { setModel } = modelSlice.actions;

export default modelSlice.reducer;

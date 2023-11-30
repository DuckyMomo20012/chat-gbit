import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { MODEL_PRICE } from '@/constants/modelPrice';

export type TModel = {
  name: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
  price: {
    prompt: number;
    completion: number;
  };
  per: number;
};

const initialState = MODEL_PRICE[0];

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setModel(state, action: PayloadAction<TModel['name']>) {
      return MODEL_PRICE.find((m) => m.name === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setModel } = modelSlice.actions;

export default modelSlice.reducer;

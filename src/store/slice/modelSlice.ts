import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { MODEL_PRICE } from '@/constants/modelPrice';

export type TModelType = 'chat' | 'audio';

export type TModel<T> = {
  type: T;
  name: string;
  price: {
    in: {
      value: number;
      per: string;
    };
    out: {
      value: number;
      per: string;
    };
  };

  provider: 'OpenAI' | 'Self-hosted';
};

export type TModelSlice = {
  [k in TModelType]: TModel<k>;
};

const initialState = {
  chat: MODEL_PRICE[0],
  audio: MODEL_PRICE[3],
} satisfies TModelSlice;

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setModel(
      state,
      action: PayloadAction<{ type: TModelType; name: string }[]>,
    ) {
      return action.payload.reduce((acc, { type, name }) => {
        const foundModel = MODEL_PRICE.find(
          (model) => model.type === type && model.name === name,
        );

        if (!foundModel) {
          return acc;
        }

        return {
          ...acc,
          [type]: foundModel,
        };
      }, state);
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

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { MODEL_LIST } from '@/constants/modelList';

export type TModelType = 'chat' | 'audio';

export type TModel<T> = {
  type: T;
  name: string;
  provider: {
    name: 'OpenAI' | 'Self-hosted';
    baseUrl?: string;
  };
};

export type TModelSlice = {
  [k in TModelType]: TModel<k>;
};

const initialState = {
  chat: MODEL_LIST[0],
  audio: MODEL_LIST[4],
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
        const foundModel = MODEL_LIST.find(
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

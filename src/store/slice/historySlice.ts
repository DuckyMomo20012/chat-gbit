import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

export type TChatHistory = {
  id: string;
  messages: Array<string>;
  model: string;
  token: string;
};

const initialState: Array<TChatHistory> = [];

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<Omit<TChatHistory, 'id'>>) => {
      const { payload } = action;

      state.push({
        ...payload,
        id: nanoid(),
      });
    },

    removeHistory: (
      state,
      action: PayloadAction<{ id: TChatHistory['id'] }>,
    ) => {
      const { payload } = action;

      return state.filter((history) => history.id !== payload.id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { addHistory, removeHistory } = historySlice.actions;

export default historySlice.reducer;

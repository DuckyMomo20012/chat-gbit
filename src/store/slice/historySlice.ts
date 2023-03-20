import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { CreateCompletionResponseUsage } from 'openai';
import { PURGE } from 'redux-persist';
import { Simplify } from 'type-fest';
import type { RootState } from '@/store/store';

export type TChatHistory = Simplify<
  {
    id: string;
    title: string;
  } & CreateCompletionResponseUsage
>;

const historyAdapter = createEntityAdapter<TChatHistory>();

const historySlice = createSlice({
  name: 'history',
  initialState: historyAdapter.getInitialState(),
  reducers: {
    addHistory: historyAdapter.addOne,

    updateToken: (
      state,
      action: PayloadAction<Omit<TChatHistory, 'title'>>,
    ) => {
      const { payload } = action;

      const {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        id,
      } = payload;

      const existing = state.entities[id];

      historyAdapter.updateOne(state, {
        id,
        changes: {
          prompt_tokens: (existing?.prompt_tokens || 0) + promptTokens,
          completion_tokens:
            (existing?.completion_tokens || 0) + completionTokens,
          total_tokens: (existing?.total_tokens || 0) + totalTokens,
        },
      });
    },

    removeHistory: historyAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return historyAdapter.removeAll(state);
    });
  },
});

export const { addHistory, updateToken, removeHistory } = historySlice.actions;

export default historySlice.reducer;

export const { selectAll: selectHistories, selectById: selectHistoryById } =
  historyAdapter.getSelectors((state: RootState) => state.history);

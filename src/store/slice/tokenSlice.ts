import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type OpenAI } from 'openai';
import { PURGE } from 'redux-persist';

const initialState: OpenAI.CompletionUsage = {
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    addTokens: (state, action: PayloadAction<OpenAI.CompletionUsage>) => {
      const { payload } = action;

      const {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
      } = payload;

      return {
        prompt_tokens: state.prompt_tokens + promptTokens,
        completion_tokens: state.completion_tokens + completionTokens,
        total_tokens: state.total_tokens + totalTokens,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { addTokens } = tokenSlice.actions;

export default tokenSlice.reducer;

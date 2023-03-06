import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
} from 'openai';
import { PURGE } from 'redux-persist';

export type TChat =
  | {
      role: ChatCompletionRequestMessageRoleEnum;
      content: string;
      isTyping: boolean;
    } & Partial<CreateChatCompletionResponse>;

const initialState: Array<TChat> = [];

const convoSlice = createSlice({
  name: 'convo',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<TChat, 'id'>>) => {
      const { payload } = action;

      state.push({
        ...payload,
        id: nanoid(),
      });
    },
    mutateMessage: (
      state,
      action: PayloadAction<{
        id: TChat['id'];
        mutation: Partial<TChat>;
      }>,
    ) => {
      const { payload } = action;

      const message = state.find((m) => m.id === payload.id);

      if (message) {
        Object.assign(message, { ...message, ...payload.mutation });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { addMessage, mutateMessage } = convoSlice.actions;

export default convoSlice.reducer;

import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
} from 'openai';
import { PURGE } from 'redux-persist';

export type TChat =
  | {
      id: string;
      role: ChatCompletionRequestMessageRoleEnum;
      content: string;
      isTyping: boolean;
      hidden?: boolean;
      trained?: boolean;
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

    removeMessage: (state, action: PayloadAction<{ id: TChat['id'] }>) => {
      const { payload } = action;

      return state.filter((message) => message.id !== payload.id);
    },

    setTyping: (
      state: Array<TChat>,
      action: PayloadAction<{ id: TChat['id']; isTyping: boolean }>,
    ) => {
      const { payload } = action;

      const { id, isTyping } = payload;

      return state.map((message) =>
        message.id === id ? { ...message, isTyping } : message,
      );
    },

    mutateMessage: (
      state,
      action: PayloadAction<{
        id: TChat['id'];
        mutation: Partial<TChat>;
      }>,
    ) => {
      const { payload } = action;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...mutation } = payload.mutation;

      return state.map((message) =>
        message.id === payload.id ? { ...message, ...mutation } : message,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { addMessage, removeMessage, setTyping, mutateMessage } =
  convoSlice.actions;

export default convoSlice.reducer;

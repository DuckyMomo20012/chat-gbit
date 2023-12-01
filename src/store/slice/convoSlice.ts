import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type OpenAI } from 'openai';
import { PURGE } from 'redux-persist';
import type { RootState } from '@/store/store';

export type TChat =
  | {
      id: string;
      role: OpenAI.Chat.ChatCompletionRole;
      content: string;
      isTyping: boolean;
      hidden?: boolean;
      trained?: boolean;
    } & Partial<OpenAI.Chat.ChatCompletion>;

const convoAdapter = createEntityAdapter<TChat>();

const convoSlice = createSlice({
  name: 'convo',
  initialState: convoAdapter.getInitialState(),
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<TChat, 'id'>>) => {
      const { payload } = action;

      convoAdapter.addOne(state, {
        ...payload,
        id: nanoid(),
      });
    },

    removeMessage: convoAdapter.removeOne,

    // FIXME: This is a temporary implementation for backward compatibility.
    setTyping: (
      state,
      action: PayloadAction<{ id: TChat['id']; isTyping: boolean }>,
    ) => {
      const { payload } = action;

      const { id, isTyping } = payload;

      convoAdapter.updateOne(state, {
        id,
        changes: {
          isTyping,
        },
      });
    },

    // FIXME: This is a temporary implementation for backward compatibility.
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

      convoAdapter.updateOne(state, {
        id: payload.id,
        changes: mutation,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return convoAdapter.removeAll(state);
    });
  },
});

export const { addMessage, removeMessage, setTyping, mutateMessage } =
  convoSlice.actions;

export default convoSlice.reducer;

export const { selectAll: selectAllConvo, selectById: selectConvoById } =
  convoAdapter.getSelectors((state: RootState) => state.convo);

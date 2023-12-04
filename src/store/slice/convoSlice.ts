import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type OpenAI } from 'openai';
import { PURGE } from 'redux-persist';
import type { RootState } from '@/store/store';

export type TChat = {
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
    addPrompt: (state, action: PayloadAction<Omit<TChat, 'id' | 'role'>>) => {
      const { payload } = action;

      const lastMessage = convoAdapter.getSelectors().selectAll(state).at(-1);

      // NOTE: Mutate last prompt message if there is no completion added
      if (lastMessage?.role === 'user') {
        convoAdapter.updateOne(state, {
          id: lastMessage.id,
          changes: {
            content: lastMessage.content + payload.content,
          },
        });

        return;
      }

      // NOTE: Add new prompt message if there is a completion added before this
      // message
      convoAdapter.addOne(state, {
        ...payload,
        id: nanoid(),
        role: 'user',
      });
    },

    addCompletion: (
      state,
      action: PayloadAction<Omit<TChat, 'id' | 'role'>>,
    ) => {
      const { payload } = action;

      convoAdapter.addOne(state, {
        ...payload,
        id: nanoid(),
        role: 'assistant',
      });
    },

    addSystemMessage: (
      state,
      action: PayloadAction<Omit<TChat, 'id' | 'role'>>,
    ) => {
      const { payload } = action;

      convoAdapter.addOne(state, {
        ...payload,
        id: nanoid(),
        role: 'system',
      });
    },

    removeMessage: convoAdapter.removeOne,

    removeAllMessage: convoAdapter.removeAll,

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

    clearTypingMessage: (state) => {
      const typingMessage = convoAdapter
        .getSelectors()
        .selectAll(state)
        .find((message) => message.isTyping);

      if (typingMessage) {
        convoAdapter.updateOne(state, {
          id: typingMessage.id,
          changes: {
            isTyping: false,
          },
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return convoAdapter.removeAll(state);
    });
  },
});

export const {
  addPrompt,
  addCompletion,
  addSystemMessage,
  removeMessage,
  removeAllMessage,
  setTyping,
  mutateMessage,
  clearTypingMessage,
} = convoSlice.actions;

export default convoSlice.reducer;

export const { selectAll: selectAllConvo, selectById: selectConvoById } =
  convoAdapter.getSelectors((state: RootState) => state.convo);

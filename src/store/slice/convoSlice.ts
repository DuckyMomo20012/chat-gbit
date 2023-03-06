import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TChat } from '@/components/elements/Message';

const initialState: Array<TChat> = [];

const convoSlice = createSlice({
  name: 'convo',
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{
        type: TChat['type'];
        text: string;
        isTyping: boolean;
      }>,
    ) => {
      const { payload } = action;

      state.push({
        id: nanoid(),
        type: payload.type,
        text: payload.text,
        isTyping: payload.isTyping,
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
});

export const { addMessage, mutateMessage } = convoSlice.actions;

export default convoSlice.reducer;

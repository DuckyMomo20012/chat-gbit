import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { PURGE } from 'redux-persist';
import {
  TChat,
  addMessage,
  mutateMessage,
  selectConvoById,
} from './convoSlice';
import type { RootState } from '@/store/store';

export type TChatHistory = {
  id: string;
  title: string;
  convo: string[];
};

const historyAdapter = createEntityAdapter<TChatHistory>();

export const addConvoMessage = createAsyncThunk<
  string,
  { historyId: string; message: Omit<TChat, 'id'> }
>('history/addConvoMessage', ({ historyId, message }, thunkAPI) => {
  // if (!historyId) {
  //   return thunkAPI.rejectWithValue('historyId is required');
  // }

  const allMessageIds = (thunkAPI.getState() as RootState).history.entities[
    historyId
  ]?.convo;
  console.log('allMessageIds', allMessageIds);

  const lastMessageId = allMessageIds?.at(-1);

  if (lastMessageId) {
    const lastMessage = selectConvoById(
      thunkAPI.getState() as RootState,
      lastMessageId,
    );

    if (lastMessage?.role === 'user') {
      thunkAPI.dispatch(
        mutateMessage({
          id: lastMessageId,
          mutation: {
            content: lastMessage.content + message.content,
          },
        }),
      );
    }
  }

  const newMessageId = nanoid();

  thunkAPI.dispatch(addMessage({ ...message, id: newMessageId }));

  (thunkAPI.getState() as RootState).history.entities[historyId]?.convo.push(
    newMessageId,
  );

  return newMessageId;
});

const historySlice = createSlice({
  name: 'history',
  initialState: historyAdapter.getInitialState(),
  reducers: {
    addHistory: historyAdapter.addOne,

    updateTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const history = state.entities[id];

      if (!history) {
        return;
      }

      history.title = title;
    },

    mutateMessage: historyAdapter.updateOne,

    removeHistory: historyAdapter.removeOne,

    removeAllHistory: historyAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return historyAdapter.removeAll(state);
    });

    builder.addCase(addConvoMessage.fulfilled, (state, action) => {
      console.log('state', state);
      console.log('action', action);
    });
  },
});

export const { addHistory, updateTitle, removeHistory, removeAllHistory } =
  historySlice.actions;

export default historySlice.reducer;

export const { selectAll: selectHistories, selectById: selectHistoryById } =
  historyAdapter.getSelectors((state: RootState) => state.history);

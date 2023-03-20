import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { PURGE } from 'redux-persist';
import type { RootState } from '@/store/store';

export type TChatHistory = {
  id: string;
  title: string;
};

const historyAdapter = createEntityAdapter<TChatHistory>();

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

    removeHistory: historyAdapter.removeOne,

    removeAllHistory: historyAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      return historyAdapter.removeAll(state);
    });
  },
});

export const { addHistory, updateTitle, removeHistory, removeAllHistory } =
  historySlice.actions;

export default historySlice.reducer;

export const { selectAll: selectHistories, selectById: selectHistoryById } =
  historyAdapter.getSelectors((state: RootState) => state.history);

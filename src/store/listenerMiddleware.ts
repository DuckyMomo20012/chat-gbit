import {
  addListener,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import type { TypedAddListener, TypedStartListening } from '@reduxjs/toolkit';
import { CreateCompletionResponseUsage } from 'openai';
import { addMessage, mutateMessage } from './slice/convoSlice';
import type { AppDispatch, RootState } from './store';
import {
  addHistory,
  selectHistoryById,
  updateToken,
} from '@/store/slice/historySlice';

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

const DEFAULT_TITLE = 'New Chat';

startAppListening({
  matcher: isAnyOf(addMessage, mutateMessage),
  effect: (action, listenerApi) => {
    // REVIEW: Currently, add new history entry when a new message is added and
    // the history entry does not exist. This is a temporary solution until we
    // can find a better way to handle this.
    if (action.type === addMessage.type) {
      const chatHistory = selectHistoryById(
        listenerApi.getState(),
        action.payload.chatId,
      );

      if (!chatHistory) {
        listenerApi.dispatch(
          addHistory({
            id: action.payload.chatId,
            title: DEFAULT_TITLE,
            completion_tokens: 0,
            prompt_tokens: 0,
            total_tokens: 0,
          }),
        );
      }
    }

    // NOTE: Update the token usage when a new message is added or mutated.
    if (action.payload?.usage) {
      listenerApi.dispatch(
        updateToken({
          ...(action.payload.usage as CreateCompletionResponseUsage),
          id: action.payload.chatId,
        }),
      );
    }
  },
});

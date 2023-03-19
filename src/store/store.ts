import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import convoReducer, { addMessage, mutateMessage } from './slice/convoSlice';
import historyReducer from './slice/historySlice';
import modelReducer from './slice/modelSlice';
import tokenReducer, { addTokens } from './slice/tokenSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    convo: convoReducer,
    model: modelReducer,
    token: tokenReducer,
    history: historyReducer,
  }),
);

const listenerMiddleware = createListenerMiddleware();

// NOTE: Listen to addMessage and mutateMessage actions to update "real" token
// usage
listenerMiddleware.startListening({
  matcher: isAnyOf(addMessage, mutateMessage),
  effect: (action, listenerApi) => {
    if (action.payload?.usage) {
      listenerApi.dispatch(addTokens(action.payload.usage));
    }
  },
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

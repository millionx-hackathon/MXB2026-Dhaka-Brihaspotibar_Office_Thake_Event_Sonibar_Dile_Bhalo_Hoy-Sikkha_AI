import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import practiceReducer from './slices/practiceSlice';
import bookReaderReducer from './slices/bookReaderSlice';
import storage from './storage';

const rootReducer = combineReducers({
  practice: practiceReducer,
  bookReader: bookReaderReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['practice', 'bookReader'], // Persist practice and bookReader state
  migrate: (state: any) => {
    // Ensure bookReader state has all required properties
    if (state && state.bookReader) {
      if (!state.bookReader.flashcards) {
        state.bookReader.flashcards = {};
      }
      if (!state.bookReader.pageSummaries) {
        state.bookReader.pageSummaries = {};
      }
      if (!state.bookReader.lastReadPages) {
        state.bookReader.lastReadPages = {};
      }
      if (!state.bookReader.readingSessions) {
        state.bookReader.readingSessions = {};
      } else {
        // Ensure all reading sessions have required properties
        Object.keys(state.bookReader.readingSessions).forEach((key) => {
          const session = state.bookReader.readingSessions[key];
          if (session) {
            if (!session.bookmarks) {
              session.bookmarks = [];
            }
            if (!session.highlightedPages) {
              session.highlightedPages = [];
            }
            if (session.readingTime === undefined) {
              session.readingTime = 0;
            }
            if (!session.lastReadAt) {
              session.lastReadAt = Date.now();
            }
            if (session.totalPagesRead === undefined) {
              session.totalPagesRead = 0;
            }
          }
        });
      }
      if (!state.bookReader.textHighlights) {
        state.bookReader.textHighlights = {};
      }
    }
    return Promise.resolve(state);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


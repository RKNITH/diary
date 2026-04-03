import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import diaryReducer from './slices/diarySlice';
import entryReducer from './slices/entrySlice';
import summaryReducer from './slices/summarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diaries: diaryReducer,
    entries: entryReducer,
    summary: summaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

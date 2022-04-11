import { configureStore } from '@reduxjs/toolkit';

import contractReducer from './contractSlice';

export default configureStore({
  reducer: {
    contract: contractReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
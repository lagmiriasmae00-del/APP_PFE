import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // تقدر تزيد هنا moduleReducer مثلاً
  },
});
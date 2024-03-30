import { configureStore } from '@reduxjs/toolkit';
import  userReducer  from './user/userSlice';

// changed the name to userReducer from userSlice


export const store = configureStore({
  reducer: {user:userReducer},
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck:false,
  }),
})
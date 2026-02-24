import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import transactionSlice from "./slices/transactionSlice";
import monthlySummarySlice from './slices/monthlySummarySlice'
import groupSlice from './slices/groupSlice'


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";



const rootReducer = combineReducers({
  auth: authSlice,
  transaction: transactionSlice,
  monthlySummary: monthlySummarySlice,
  groups: groupSlice
  
});


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "transaction", "monthlySummary", "groups"],

};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

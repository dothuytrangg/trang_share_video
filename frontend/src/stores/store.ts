'use client';

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  masterSlice, { initialBootState }  from "./features/masterSlice";


const rootReducer = combineReducers({
  master: masterSlice,

});
export const makeStore = () => {
  return configureStore({
    reducer:rootReducer
  },);
};
// makeStore().dispatch(initialBootState())




// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


'use client';

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  masterSlice, { initialBootState }  from "./features/masterSlice";
import middleware from "@/middleware";
import { nextLocalStorage } from "@/util/localStoreage";

const reHydrateStore = () => {
  console.log(3)
  if (nextLocalStorage()?.getItem('master') !== null) {
  
    return JSON.parse(nextLocalStorage()?.getItem('master') as any); // re-hydrate the store
  }
};
const rootReducer = combineReducers({
  master: masterSlice,

});
export const makeStore = () => {
  return configureStore({
    // preloadedState: reHydrateStore(),
    reducer:rootReducer
  },);
};




// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


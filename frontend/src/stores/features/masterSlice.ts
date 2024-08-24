"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  theme: string;
}

const initialState: CounterState = {
  theme: "light",
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    changeTheme: (state) => {
        if(state.theme == 'light'){
            state.theme = 'dark'
        }else{
              state.theme = 'light'
        }
    },
  },
});

export const { changeTheme } = masterSlice.actions;

export default masterSlice.reducer;

"use client";

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  theme: "light",
  drawer: false,
  dark:false
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    changeTheme: (state) => {
      if (state.theme == "light") {
        state.theme = "dark";
        state.dark = false
      } else {
        state.theme = "light";
        state.dark = true
      }
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
    },
  },
});

export const { changeTheme, toggleDrawer } = masterSlice.actions;

export default masterSlice.reducer;

"use client";

import { createSlice } from "@reduxjs/toolkit";

type MasterStore = {
  theme: String;
  drawer: Boolean;
};
const initialState: MasterStore = {
  theme: "light",
  drawer: false,
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    changeTheme: (state) => {
      if (state.theme == "light") {
        state.theme = "dark";
      } else {
        state.theme = "light";
      }
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
    },
  },
});

export const { changeTheme, toggleDrawer } = masterSlice.actions;

export default masterSlice.reducer;

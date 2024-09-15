"use client";

import { _GLOBAL } from "@/contstants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  drawer: true,
  dark: false,
  lang: _GLOBAL.VN,
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    changeTheme: (state) => {
      if (state.theme == "light") {
        state.theme = "dark";
        state.dark = false;
      } else {
        state.theme = "light";
        state.dark = true;
      }
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { changeTheme, toggleDrawer, changeLanguage } = masterSlice.actions;

export default masterSlice.reducer;

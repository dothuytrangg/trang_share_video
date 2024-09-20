"use client";

import { _GLOBAL } from "@/contstants";
import { nextLocalStorage } from "@/util/localStoreage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  drawer: true,
  dark: false,
  loading: true,
  lang: "vn",
  teo: "",
  is_login: false,
  access_token: "",
  user: "",
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("action: ", action);
      state.access_token = action.payload.token;
      state.user = action.payload.user;
      state.is_login = true;
    },
    initialBootState: (state) => {
      let masterLocalStorage = nextLocalStorage()?.getItem("master");
      if (masterLocalStorage) {
        let parseLocalStorage = JSON.parse(masterLocalStorage);
        state.theme = parseLocalStorage.theme;
        state.drawer = parseLocalStorage.drawer;
        state.dark = parseLocalStorage.dark;
        state.lang = parseLocalStorage.lang;
        state.is_login = parseLocalStorage.is_login;
        state.access_token = parseLocalStorage.access_token;
        state.user = parseLocalStorage.user;
      } else {
        nextLocalStorage()?.setItem("master", JSON.stringify(initialState));
      }
      state.loading = false;
      console.log("state.loading : ", state.loading);
    },
    changeTheme: (state) => {
      if (state.theme == "light") {
        state.theme = "dark";
        state.dark = false;
      } else {
        state.theme = "light";
        state.dark = true;
      }
      updateLocalStorage();
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
    },
    closeDrawer: (state) => {
      state.drawer = false;
    },
    changeLanguage: (state, action) => {
      state.lang = "en";
      state.teo = action.payload;
      console.log(" state.lang: ", state.lang);
    },
    updateLocalStorage: (state: any) => {
      nextLocalStorage()?.setItem("master", JSON.stringify(state));
    },
    logout: (state) => {
      state.is_login = false;
      state.user = "";
      state.access_token = "";
      updateLocalStorage();
    },
  },
});

export const { changeTheme, toggleDrawer, changeLanguage, initialBootState, updateLocalStorage, loginSuccess, logout, closeDrawer } =
  masterSlice.actions;

export default masterSlice.reducer;

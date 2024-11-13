"use client";

import { _GLOBAL } from "@/contstants";
import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
const initialState = {
  theme: "light",
  drawer: true,
  dark: false,
  loading: true,
  lang: "vn",
  teo: "",
  is_login: false,
  access_token: "",
  isAdmin:false,
  isAuth:false,
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
  
      if(action.payload.user.role == _GLOBAL.ROLE_ADMIN){
        state.isAdmin = true;
      }
      state.isAuth = true;
      console.log('state master: ', state);
    },
    setIsAdmin : (state,action) =>{
      state.isAdmin = action.payload
    },
    setIsAuth : (state,action) =>{
      state.isAuth = action.payload
    },
    initialBootState: (state) => {
      if(typeof window !== 'undefined'){
        let masterLocalStorage = secureLocalStorage.getItem("master") as string;
        if (masterLocalStorage) {
          let parseLocalStorage = JSON.parse(masterLocalStorage);
          state.theme = parseLocalStorage.theme;
          state.drawer = parseLocalStorage.drawer;
          state.dark = parseLocalStorage.dark;
          state.lang = parseLocalStorage.lang;
          state.isAdmin = parseLocalStorage.isAdmin;
          state.isAuth = parseLocalStorage.isAuth;
          state.is_login = parseLocalStorage.is_login;
          state.access_token = parseLocalStorage.access_token;
          state.user = parseLocalStorage.user;
        } else {
          secureLocalStorage.setItem("master", JSON.stringify(initialState));
        }
        state.loading = false;
      }
    },
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
    closeDrawer: (state) => {
      state.drawer = false;
    },
    changeLanguage: (state, action) => {
      state.lang = "en";
      state.teo = action.payload;
    },
    updateLocalStorage: (state: any) => {
     secureLocalStorage.setItem("master", JSON.stringify(state));
    },
    logout: (state) => {
      state.is_login = false;
      state.isAdmin = false;
      state.isAuth = false;
      state.user = "";
      state.access_token = "";
    },
  },
});

export const { changeTheme, toggleDrawer, changeLanguage, initialBootState, updateLocalStorage, loginSuccess, logout, closeDrawer,setIsAdmin, setIsAuth } =
  masterSlice.actions;

export default masterSlice.reducer;

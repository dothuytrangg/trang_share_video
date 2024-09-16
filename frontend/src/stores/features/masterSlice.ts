"use client";

import { _GLOBAL } from "@/contstants";
import { nextLocalStorage } from "@/util/localStoreage";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  theme: "light",
  drawer: true,
  dark: false,
  lang: _GLOBAL.VN,
  is_login:false,
  access_token:'',
  user:''
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    initialBootState : (state) =>{
      let masterLocalStorage = nextLocalStorage()?.getItem('master');
      if(masterLocalStorage){
        let parseLocalStorage = JSON.parse(masterLocalStorage);
          state.theme = parseLocalStorage.theme
          state.drawer = parseLocalStorage.drawer
          state.dark = parseLocalStorage.dark
          state.lang = parseLocalStorage.lang
          state.is_login = parseLocalStorage.is_login
          state.access_token = parseLocalStorage.access_token
          state.user = parseLocalStorage.user
      }else{
        nextLocalStorage()?.setItem('master',JSON.stringify(initialState));
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
      updateLocalStorage();
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;

    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    updateLocalStorage: (state:any)=>{
      console.log('state: ', state);
      nextLocalStorage()?.setItem('master',JSON.stringify(state));
    }
    
  },
});

export const { changeTheme, toggleDrawer, changeLanguage, initialBootState, updateLocalStorage } = masterSlice.actions;

export default masterSlice.reducer;

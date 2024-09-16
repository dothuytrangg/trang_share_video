"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "./stores/hookStore";
import { PaletteMode } from "@mui/material";
import { useState } from "react";
import { nextLocalStorage } from "./util/localStoreage";
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Theme({ children }: { children: React.ReactNode }) {
  let defaultTheme = '';
  let masterStore = useAppSelector((state) => state.master);
  if(nextLocalStorage()?.getItem('master')){
    let parseStorage = JSON.parse(nextLocalStorage()?.getItem('master') as any);
    if(parseStorage.theme){
      defaultTheme = parseStorage.theme;
    }else{
      defaultTheme = masterStore.theme;
    }
  }else{
    defaultTheme = masterStore.theme;
  }

  console.log('defaultTheme: ', defaultTheme);
  const themeConfig = createTheme({
    palette: {
      mode: masterStore.theme as PaletteMode,
      ...(masterStore.theme === 'light'
        ? {
          // Light mode colors
          primary: {
            // main: '#1976d2',
            main: '#fff',
          },
          secondary: {
            main: '#9c27b0',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
        }
        : {
          // Dark mode colors
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#ce93d8',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
        }),
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });

  return <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>;
}

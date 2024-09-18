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

  const themeConfig = createTheme({
    palette: {
      mode: masterStore.theme as PaletteMode,
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });

  return <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>;
}

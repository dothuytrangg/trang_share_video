"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "./stores/hookStore";
import { PaletteMode } from "@mui/material";
import { useEffect, useState } from "react";
import { nextLocalStorage } from "./util/localStoreage";
import { useDispatch } from "react-redux";
import { initialBootState } from "./stores/features/masterSlice";
import StoreProvider from "./stores/providers";
import { makeStore, AppStore } from "./stores/store";
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
makeStore().dispatch(initialBootState());

export default function Theme({ children }: { children: React.ReactNode }) {
  let defaultTheme: any = "";

  let masterStore = useAppSelector((state) => state.master);
  // useEffect(() => {
  //   defaultTheme = masterStore.theme;
  // });
  // if (!defaultTheme) {
    if (nextLocalStorage()?.getItem("master")) {
      var parseStorage = JSON.parse(nextLocalStorage()?.getItem("master") as any);
      if (parseStorage.theme) {
        defaultTheme = parseStorage.theme;
      } else {
        defaultTheme = masterStore.theme;
      }
    } else {
      defaultTheme = masterStore.theme;
    }
  // }

    var themeConfig = createTheme({
      palette: {
        mode:defaultTheme,
      },
      typography: {
        fontFamily: roboto.style.fontFamily,
      },
    });



  return (
  
  <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>


  );
}

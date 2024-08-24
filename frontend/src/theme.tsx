"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "./stores/hookStore";
import { PaletteMode } from "@mui/material";
import { useState } from "react";
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Theme({ children }: { children: React.ReactNode }) {
  const masterStore = useAppSelector((state) => state.master);
  const themeConfig = createTheme({
    palette: {
      mode: masterStore.theme as PaletteMode,
      primary: {
        main: '#00d483',
      },
      secondary: {
        main: '#c20424',
      },
     
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });

  return <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>;
}

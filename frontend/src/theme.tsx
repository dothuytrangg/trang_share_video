"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "./stores/hookStore";
import { PaletteMode } from "@mui/material";
import { useEffect, useState } from "react";
import { _GLOBAL } from "./contstants";
import secureLocalStorage from "react-secure-storage";
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Theme({ children }: { children: React.ReactNode }) {
  
  let defaultTheme = _GLOBAL.DEFAULT_THEME;
  let [mode, setMode] = useState(defaultTheme);
  const masterStore = useAppSelector((state) => state.master);

    let masterLocal:any;
    if (global?.window !== undefined) {
      masterLocal = secureLocalStorage.getItem("master");
      // console.log('masterlocal',masterLocal)
    }
      
    if (masterLocal) {
      let parseLocal = JSON.parse(masterLocal) as any;
      defaultTheme = parseLocal.theme;
    }
  
    useEffect(() => {
      setMode(masterStore.theme);
      
    }, [masterStore]);
    const themeConfig = createTheme({
      palette: {
        mode: mode as PaletteMode,
        secondary: {
          main: '#fff',
        },
      },
     
      typography: {
        fontFamily: roboto.style.fontFamily,
      },
    });
  


  return <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>;
}

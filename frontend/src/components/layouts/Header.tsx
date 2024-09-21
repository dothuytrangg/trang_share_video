"use client";

import { _GLOBAL } from "@/contstants";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { usePathname, useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setIsAdmin, setIsAuth } from "@/stores/features/masterSlice";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const masterStore = useAppSelector((state) => state.master)
  const [routeAdmin, setRouteAdmin] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  useEffect(() => {
    setLoading(masterStore.loading)
    setTheme(masterStore.theme)
    middlewareApp();
  }, [pathname, theme])

  const redirectPermissionPage = () => {
    return router.replace(`/${locale}/errors/permission`);
  }

  const middlewareApp = () => {
    const locales = ["en", "vn"] as const;
    const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";
   
    const publicPathnameRegex = RegExp(excludePattern, "i");

    let isAdminPage = publicPathnameRegex.test(pathname);

    if (isAdminPage) {
   
      setRouteAdmin(true)
      let localUser = JSON.parse(secureLocalStorage.getItem(_GLOBAL.LOCAL_STOREAGE) as string);
      if (localUser) {
        if (localUser.user.role == _GLOBAL.ROLE_ADMIN) {
          dispatch(setIsAdmin(true));
          return
        } else {
          redirectPermissionPage();
        }
      } else {
        redirectPermissionPage();
      }
    }else{
      setRouteAdmin(false)
      
    }
  
  }
  const renderLayout = () => {
    let classNameBackground = routeAdmin ? (masterStore.theme == _GLOBAL.LIGHT ? 'bg-gray-100' : '') : ''
    if (loading) {
      return <Backdrop

        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    } else {
      return <Box className={ classNameBackground} sx={{ display: "flex", height: '100vh' }}>
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
          {children}
        </Box>

      </Box>
    }
  }

  return renderLayout()
}

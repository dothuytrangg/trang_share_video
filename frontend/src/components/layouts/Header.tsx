"use client";

import { _GLOBAL } from "@/contstants";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { usePathname, useRouter,useSearchParams } from "next/navigation";
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
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const searchQueryParams = useSearchParams();
  useEffect(() => {
    setLoading(masterStore.loading)
    setTheme(masterStore.theme)
    setIsAuth(masterStore.isAuth)
    middlewareApp();
  }, [pathname, theme, loading, masterStore])

  const redirectPermissionPage = () => {
    return router.replace(`/${locale}/errors/permission`);
  }

  const middlewareApp = () => {

    const locales = ["en", "vn"] as const;
    const excludePattern = "^(/(" + locales.join("|") + "))?/admin/?.*?$";
    const preventRouter = "^(/(" + locales.join("|") + "))?/(login|register)/?.*?$";

    const publicPathnameRegex = RegExp(excludePattern, "i");
 
   
    // return;
    let isAdminPage = publicPathnameRegex.test(pathname);
 
    if (isAuth) {
      if (RegExp(preventRouter, "i").test(pathname)) {
        // router.push(`/${locale}`)
      }
    }

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
    } else {
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
      return <Box className={classNameBackground} sx={{ display: "flex", height: '100vh' }}>
          <Navbar></Navbar>
          <Sidebar></Sidebar>
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
        <React.StrictMode>
            {children}
        </React.StrictMode>
          </Box>
      </Box>
    }
  }

  return renderLayout()
}

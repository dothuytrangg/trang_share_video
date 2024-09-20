"use client";

import { _GLOBAL } from "@/contstants";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from "@/stores/hookStore";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const masterStore = useAppSelector((state) => state.master)
  useEffect(() => {
    setLoading(masterStore.loading)
    setTheme(masterStore.theme)
  })
  const renderLayout = () =>{
    if(loading){
     return <Backdrop
     
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    }else{
      return  <Box className={(theme == _GLOBAL.LIGHT ? 'bg-gray-100' : '')} sx={{ display: "flex" ,height:'100vh'}}>
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

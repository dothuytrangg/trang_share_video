"use client";
import { CSSObject, List, ListItem, ListItemButton, ListItemText, styled, Theme, useTheme, Tooltip, useMediaQuery } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import MuiDrawer from "@mui/material/Drawer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/stores/hookStore";
import { changeTheme, closeDrawer, toggleDrawer, updateLocalStorage } from "@/stores/features/masterSlice";
import PlaylistPlay from "@mui/icons-material/PlaylistPlay";
import History from "@mui/icons-material/History";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { useLocale, useTranslations } from "next-intl";
import { _GLOBAL } from "@/contstants";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect, useState } from "react";
import { VideoLibraryOutlined } from "@mui/icons-material";
const drawerWidth = 200;


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useAppSelector((state) => state.master.drawer) as boolean;
  const masterStore = useAppSelector((state) => state.master);
  const t = useTranslations("HomePage");
  const router = useRouter();
  const locale = useLocale();
  const query = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [widthSideBar, setWidthSideBar] = useState(300)

  useEffect(() => {
    if (isMobile && open) {
      dispatch(closeDrawer());
    }
  }, [isMobile, open, dispatch]);
  
  const handleToggleTheme = () => {
    console.log("theme: ", theme);
    dispatch(changeTheme());
    dispatch(updateLocalStorage());
  };

  const redirectHome = () => {
    const action = query.get("action");
    console.log('action',action);
    router.replace(`/${locale}/`);
    
  };

  const handlePlayListHistory = () =>{
    router.replace(`/${locale}/playlist-history`);
    
      
  }

  const textTheme = () => {
    let result = "";
    if (masterStore.lang == _GLOBAL.EN) {
      if (masterStore.theme == _GLOBAL.DARK) {
        result = `${t("theme")} ${t("dark")}`;
      } else {
        result = `${t("light")} ${t("theme")}`;
      }
    } else {
      if (masterStore.theme == _GLOBAL.DARK) {
        result = `${t("theme")} ${t("dark")}`;
      } else {
        result = `${t("theme")} ${t("light")}`;
      }
    }
    return result;
  };
  const widthSideBar = () => {
    // console.log('open',masterStore)
    if (masterStore.drawer) 
      {
      if (locale == _GLOBAL.EN) {
        return 240
      } else {
        return 200
      }
    }

  }

  const renderButtonAdmin = () =>{
    if(masterStore.isAdmin){
     return <React.Fragment>
           <ListItemButton onClick={() => {
            router.replace(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_CATEGORY}`)
          }} sx={{ minHeight: 40, maxWidth: 300, width: 400, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("management_category")} placement="right-start">
              <CategoryIcon></CategoryIcon>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("management_category")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton onClick={() => {
            router.replace(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_ACCOUNT}`)
          }} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("management_account")} placement="right-start">
              <AccountCircleIcon></AccountCircleIcon>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("management_account")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton onClick={() => {
            router.replace(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_VIDEO}`)
          }} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("management_video")} placement="right-start">
              <VideoLibraryOutlined></VideoLibraryOutlined>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("management_video")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
     </React.Fragment>
    }
  }
  return (
 
    <Drawer sx={{
      width: widthSideBar(),
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: widthSideBar(),
        boxSizing: 'border-box',
      },

    }} variant="permanent" open={open}>
      <br />
      <br />
      <div className="mt-2"></div>
      <List>
        <ListItem className="my-1" key={1} disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={redirectHome} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("home")} placement="right-start">
              <HomeIcon fontSize="medium"></HomeIcon>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("home")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton onClick={handleToggleTheme} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("theme")} placement="right-start">
              {masterStore.theme === _GLOBAL.DARK ? <LightModeIcon></LightModeIcon> : <DarkModeIcon></DarkModeIcon>}
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("theme")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("playlist")} placement="right-start">
              <PlaylistPlay></PlaylistPlay>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("playlist")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton onClick={handlePlayListHistory} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("playlist_history")} placement="right-start">
              <History></History>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("playlist_history")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <Tooltip title={t("playlist_liked")} placement="right-start">
              <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
            </Tooltip>
            <ListItemText className={open ? "mx-3" : ""} primary={t("playlist_liked")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          

          {renderButtonAdmin()}
        </ListItem>
      </List>
    </Drawer>
  );
}

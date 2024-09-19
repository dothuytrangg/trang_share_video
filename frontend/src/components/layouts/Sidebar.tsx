"use client";
import { CSSObject, List, ListItem, ListItemButton, ListItemText, styled, Theme, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import MuiDrawer from "@mui/material/Drawer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/stores/hookStore";
import { changeTheme, toggleDrawer, updateLocalStorage } from "@/stores/features/masterSlice";
import PlaylistPlay from "@mui/icons-material/PlaylistPlay";
import History from "@mui/icons-material/History";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { useLocale, useTranslations } from "next-intl";
import { _GLOBAL } from "@/contstants";
import { redirect, useRouter } from "next/navigation";

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
  
  const handleToggleTheme = () => {
    console.log('theme: ', theme);
    dispatch(changeTheme());
    dispatch(updateLocalStorage());
  };

  const redirectHome = ()=>{
    console.log("teo")
    router.replace(`/${locale}`)
  }

  const textTheme = () => {
    let result = "";
    console.log(' (masterStore.lang : ',  (masterStore.lang ))
    if (masterStore.lang == _GLOBAL.EN) {
      console.log("masterStore.theme == _GLOBAL.DARK: ", masterStore.theme == _GLOBAL.DARK);
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
  return (
    <Drawer variant="permanent" open={open}>
      <br />
      <br />
      <div className="mt-2"></div>
      <List>
        <ListItem className="my-1" key={1} disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={redirectHome} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <HomeIcon fontSize="medium"></HomeIcon>
            <ListItemText  className={open ? "mx-3" : ""} primary={t("home")} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton onClick={handleToggleTheme} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            {masterStore.theme === _GLOBAL.DARK ? <LightModeIcon></LightModeIcon> : <DarkModeIcon></DarkModeIcon>}
            <ListItemText className={open ? "mx-3" : ""} primary={t('theme')} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <PlaylistPlay></PlaylistPlay>
            <ListItemText className={open ? "mx-3" : ""} primary={t('playlist')} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <History></History>
            <ListItemText className={open ? "mx-3" : ""} primary={t('playlist_history')} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>

          <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
            <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
            <ListItemText className={open ? "mx-3" : ""} primary={t('playlist_liked')} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

"use client";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme, Theme, CSSObject, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { changeLanguage, initialBootState, toggleDrawer, updateLocalStorage } from "@/stores/features/masterSlice";

import Image from "next/image";
import { Button, InputBase, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect } from "react";
import { AccountCircle } from "@mui/icons-material";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { useRouter, usePathname, useParams, useSearchParams, redirect } from "next/navigation";
import { format } from "path";
import { _GLOBAL } from "@/contstants";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Navbar() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const query = useParams();
  const pathName = usePathname();
  const localeRouter = useSearchParams();
  const locale = useLocale();
  const logo = "/image/logo_text.png";
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // const open = useAppSelector((state) => state.master.drawer) as boolean;
  const masterStore = useAppSelector((state:any) => state.master);
  

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
    dispatch(updateLocalStorage());
  };

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = async () => {
    let pathNameSpilt = pathName.split("/").filter((x) => x);
    let lang:any = (locale == _GLOBAL.EN ? _GLOBAL.VN : _GLOBAL.EN);
    let url = "";
    if (pathNameSpilt[0] == _GLOBAL.EN || pathNameSpilt[0] == _GLOBAL.VN) {
      pathNameSpilt[0] = lang;
      url = pathNameSpilt.join("/");
    }
    dispatch(changeLanguage(locale))
    router.push(`/${url}`);
  };

 const handleRedirectAuthenPage = () =>{
   console.log('masterStore.lang: ', masterStore.lang);
   console.log('masterStore navbar: ', masterStore);
    router.push(`/${locale}/${_GLOBAL.ROUTER_LOGIN}`)
  }

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" onClick={handleToggleDrawer} edge="start">
          <MenuIcon />
        </IconButton>

        <Typography variant="inherit" color="inherit" component="div" sx={{ flexGrow: 1 }}>
          <Image src={logo} alt="Picture of the author" width={70} height={50}></Image>
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder={t('search')+ "..."} inputProps={{ "aria-label": "search" }} />
        </Search>
        <Button color="secondary" onClick={handleRedirectAuthenPage} variant="outlined">{t('login')} & {t('register')}</Button>
        {auth && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{t('profile')}</MenuItem>
              <MenuItem onClick={handleClose}>{t('account')}</MenuItem>
              <MenuItem onClick={handleClose}>{t('setting')}</MenuItem>
              <MenuItem onClick={handleChangeLanguage}>{locale == _GLOBAL.EN ? t('vn') : t('en')}</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

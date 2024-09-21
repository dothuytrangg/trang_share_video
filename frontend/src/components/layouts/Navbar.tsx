"use client";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme, Theme, CSSObject, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { changeLanguage, initialBootState, logout, toggleDrawer, updateLocalStorage } from "@/stores/features/masterSlice";
import InputAdornment from '@mui/material/InputAdornment';
import Image from "next/image";
import { Button, InputBase, Menu, MenuItem, Box, TextField, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import React, { useEffect, useState } from "react";
import { AccountCircle, TextFields } from "@mui/icons-material";
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
  const masterStore = useAppSelector((state: any) => state.master);
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(true)
 

  useEffect(() => {
    setIsLogin(masterStore.is_login)
    setLoading(masterStore.loading)
    }, [masterStore])

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
    dispatch(updateLocalStorage());
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = async () => {
    let pathNameSpilt = pathName.split("/").filter((x) => x);
    let lang: any = (locale == _GLOBAL.EN ? _GLOBAL.VN : _GLOBAL.EN);
    let url = "";
    if (pathNameSpilt[0] == _GLOBAL.EN || pathNameSpilt[0] == _GLOBAL.VN) {
      pathNameSpilt[0] = lang;
      url = pathNameSpilt.join("/");
    }
    dispatch(changeLanguage(locale))
    router.push(`/${url}`);
  };

  const handleRedirectAuthenPage = () => {
    router.push(`/${locale}/${_GLOBAL.ROUTER_LOGIN}`)
  }


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const renderButtonThreeDot = () => {
    if (!isLogin) {
      return <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <MoreVertOutlinedIcon />
      </IconButton>
    }
  }
  const handleLogout = () =>{
    dispatch(logout())
    dispatch(updateLocalStorage())
    router.push(`/${locale}`)
  }

  const renderButtonAcction = () => {
    if (!isLogin) {
      return <Button onClick={handleRedirectAuthenPage} variant="outlined" startIcon={<AccountCircle />}>
        {t('login')}
      </Button>
    } else {
      return  <Button onClick={handleClick} variant="outlined" startIcon={<AccountCircle />}>
        {masterStore.user.name}
      </Button>
    }
  }
  return (
    <Box >
      <AppBar color="secondary" position="fixed">
        <Toolbar>
          <IconButton sx={{ mr: 2 }} color="inherit" aria-label="open drawer" onClick={handleToggleDrawer} edge="start">
            <MenuIcon />
          </IconButton>
                <Typography variant="inherit" color="inherit" component="div" >
              <Image src={logo} alt="Picture of the author" width={70} height={50}></Image>
            </Typography>
            <Box sx={{ flexGrow: 0.5 }} />
   
            <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
              size="small"
              style = {{width: 500}}
              placeholder={t('search') + "..."}
              
            />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          </IconButton>

          {renderButtonThreeDot()}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}

            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem className="px-5" onClick={handleClose}>{t('profile')}</MenuItem>
            <MenuItem onClick={handleClose}>{t('account')}</MenuItem>
            <MenuItem onClick={handleClose}>{t('setting')}</MenuItem>
            <MenuItem onClick={handleChangeLanguage}>{locale == _GLOBAL.EN ? t('vn') : t('en')}</MenuItem>
            <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
          </Menu>
          {renderButtonAcction()}

        </Toolbar>
      </AppBar>
    </Box>
  );
}

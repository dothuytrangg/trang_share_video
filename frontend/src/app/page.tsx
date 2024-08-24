"use client";
import * as React from "react";

import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import MailIcon from "@mui/icons-material/Mail";
import { useDispatch } from "react-redux";
import { changeTheme, toggleDrawer } from "@/stores/features/masterSlice";
import { useAppSelector } from "@/stores/hookStore";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#101010" : "grey.100"),
        color: (theme) => (theme.palette.mode === "dark" ? "grey.300" : "grey.800"),
        border: "1px solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.300"),
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

export default function MiniDrawer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useAppSelector((state) => state.master.drawer) as boolean;
  const masterStore = useAppSelector((state) => state.master);
  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const handleToggleTheme = () => {
    dispatch(changeTheme());
  };

  const renderCategory = () => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      result.push(
        <Button key={i} sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }} color="inherit" variant="contained" size="small">
          Gaming - {i + 1}
        </Button>
      );
    }
    return result;
  };

  const renderItemExample = () => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      result.push(
        <Card key={i} sx={{ maxWidth: 345 }}>
          <CardMedia sx={{ height: 140 }} image="https://mui.com/static/images/cards/contemplative-reptile.jpg" title="green iguana" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      );
    }
    return result;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleToggleDrawer} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <br />
        <br />
        <div className="mt-2"></div>
        <List>
          <ListItem className="my-1" key={1} disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
              <HomeIcon fontSize="medium"></HomeIcon>
              <ListItemText className={open ? "mx-3" : ""} primary={"Trang chủ"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            <ListItemButton onClick={handleToggleTheme} sx={{ minHeight: 40, justifyContent: open ? "initial" : "center", px: 2.5 }}>
              {masterStore.theme == "dark" ? <LightModeIcon></LightModeIcon> : <DarkModeIcon></DarkModeIcon>}
              <ListItemText className={open ? "mx-3" : ""} primary={"Chủ Đề"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Button
            sx={{ ml: 1, pr: 1, textTransform: "none", maxWidth: 200, mt: 2 }}
            color={masterStore.dark ? "secondary" : "primary"}
            variant="contained"
            size="small"
          >
            All
          </Button>
          {renderCategory()}
        </Box>
        {/* <div className="flex justify-start ...">{renderCategory()}</div> */}
        {/* <div className="grid grid-cols-12 gap-2">
          <Button
            sx={{ ml: 1, pr: 1, textTransform: "none", maxWidth: 200 }}
            color={masterStore.dark ? "secondary" : "primary"}
            variant="contained"
            size="small"
          >
            All
          </Button>
          {renderCategory()}
        </div> */}

        <br />
        <div className="grid grid-cols-5 gap-3">{renderItemExample()}</div>
      </Box>
    </Box>
  );
}

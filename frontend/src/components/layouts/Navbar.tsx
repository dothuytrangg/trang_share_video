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
import { Button, InputBase, Menu, MenuItem, Box, TextField, Grid, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import React, { useEffect, useState } from "react";
import { AccountCircle, TextFields, VideoCallOutlined } from "@mui/icons-material";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { useRouter, usePathname, useParams, useSearchParams, redirect } from "next/navigation";
import { format } from "path";
import { _ENV, _GLOBAL } from "@/contstants";
import requestApi from "../../../helpers/api";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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
  // const [user, setUser] = useState()
  const [profileData,setProfileData] = useState([]);
  const [profileAvatar,setProfileAvatar] = useState<any>(masterStore.user.avatar);;
  var ranonce = false;
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  let [errorCreate, setErrorCreate] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null >(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); 
  const [optionError, setOptionError] = useState(false);
  const [optionErrorMessage, setOptionErrorMessage] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailErrorMessage, setThumbnailErrorMessage] = useState("");
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [categoryOptions, setCategoryOptions] = useState([]);
  // const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLogin(masterStore.is_login)
     setLoading(masterStore.loading)
     loadAllCategory();

    //  setProfileAvatar(masterStore.user.avatar);
  
    if (!loading) {
      requestApi('users/profile','GET').then((res:any)=>{
        console.log('res profile',res);
         if(res.success){
             setProfileAvatar(res.data.avatar);
             setLoading(true)
         }
 
      }
 
      ).catch((err)=>{
       console.log('err',err);
      })
      
       setLoading(true)
     }
    
    console.log('masterStore: ', masterStore);
    }, [masterStore])

    const loadAllCategory = async () => {
      await requestApi(`categories/all`, "GET").then((res: any) => {
          console.log('res category all', res);
          if (res.success) {
            setCategories(res.data)
          }

      }).catch((err: any) => {
          console.error(err);
      })

  };
;

  

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
    dispatch(updateLocalStorage());
    router.push(`/${url}`);
  };

  const handleRedirectAuthenPage = () => {
    router.push(`/${locale}/${_GLOBAL.ROUTER_LOGIN}`)
  }


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  
  function slugify(str: string): string {

    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return str;
  }
  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const description = document.getElementById("description") as HTMLInputElement;
  
    let isValid = true;
  
  
    if (!name.value) {
      setNameError(true);
      setNameErrorMessage(t("name_required"));
      isValid = false;
    } else if (name.value.length < 3) {
      setNameError(true);
      setNameErrorMessage(t("name_least_3"));
      isValid = false;
    } else if (name.value.length > 70) {
      setNameError(true);
      setNameErrorMessage(t("name_more_70"));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }
  

    if (!description.value) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_required"));
      isValid = false;
    } else if (description.value.length < 10) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_least_10"));
      isValid = false;
    } else if (description.value.length > 300) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_more_300"));
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }

    if(categoryOptions.length < 1 )
    {
        setOptionError(true);
        setOptionErrorMessage(t('select_at_least_1_category'))
        isValid = false;

    }
  
   
    if (!thumbnailFile) {
      setThumbnailError(true)
      setThumbnailErrorMessage(t("thumbnail_required"))
      isValid = false;
    }

    if (!videoFile) {
      setVideoError(true)
      setVideoErrorMessage(t("video_required"))
      isValid = false;
    }
  
    return isValid;
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
  const handleProfile = ()=>{
     router.replace(`/${locale}/profile`);
     handleClose();
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        console.log(event.target.files);
        const file = event.target.files[0];
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file)); // Tạo URL để hiển thị ảnh
    }
};

const handleFileVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setVideoFile(file);
        console.log(file);

    }
};



  
  const handleCreateVideo = (): void => {
    const valid: boolean = validateInputs();

    if (valid && thumbnailFile && videoFile) {
        const slug = slugify(name);
        const formData = new FormData();


        formData.append("thumbnail", thumbnailFile);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("slug", slug);
        formData.append("url", videoFile);
        categoryOptions.forEach((category:any) => {
            formData.append("categories[]", category.id);
        });
        
        // formData.append("categories", JSON.stringify(categoryOptions.filter((category: any) => category.name !=='All').map((category:any) => category.id)));
        console.log(thumbnailFile)
        console.log(videoFile)

        requestApi("videos", "POST", formData)
            .then((res: any) => {
                if (res.success) {
                    setOpenAddDialog(false);
                    // setThumbnailFile(null);
                    setThumbnailPreview(null);
                    setVideoFile(null);     
                    setCategoryOptions([]); 
                    setSnackbarMessage(t("create_video_success"));
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);

                    // loadVideos(page);
                } else {
                    setErrorCreate(res.message || t("create_video_failed"));
                    setSnackbarMessage(res.message || t("create_video_failed"));
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((err: any) => {
                console.error("Create video failed:", err);
                setSnackbarMessage(t("create_video_occurred"));
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    } else {
        console.log('No file selected for thumbnail or video');
    }
};





  const renderButtonAcction = () => {
    if (!isLogin) {
      return <Button onClick={handleRedirectAuthenPage} variant="outlined" startIcon={<AccountCircle />}>
        {t('login')}
      </Button>
    } else {
      return (
        
        <Box>
          {/* <img src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${masterStore.user.avatar}`} ></img> */}
          <Button onClick={()=>setOpenAddDialog(true)} variant="outlined" style={{width:20,height:35,margin:10}}  startIcon={<VideoCallOutlined style={{width:30,height:30}}/>}>
          </Button>
           <Button onClick={handleClick} variant="outlined" startIcon={profileAvatar
      ? (<Avatar src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${profileAvatar}`} sx={{ width: 25, height: 25}}/>) 
      :(<AccountCircle sx={{ width: 25, height: 25}} />)}>
        {masterStore.user.name}
      </Button>

      
      
        </Box>
      )
      
    }


  }
  const [categories, setCategories] = useState([]);
  const categoryData = categories
  .filter((category: any) => category.name !=='All')
  .map((category: any) => ({
      label: `${category.name}`,
      id: `${category.id}`
  }));







  return (
    <Box >
      <AppBar color="secondary" position="fixed">
        <Toolbar>
          <IconButton sx={{ mr: 2 }} color="inherit" aria-label="open drawer" onClick={handleToggleDrawer} edge="start">
            <MenuIcon />
          </IconButton>
                <Typography variant="inherit" color="inherit" component="div" >
              <Image onClick={()=>{
                router.replace(`/${locale}`)
              }} src={logo} alt="Picture of the author" width={70} height={50}></Image>
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
{/* 
          {renderButtonThreeDot()} */}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}

            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem className="px-5" onClick={handleProfile}>{t('profile')}</MenuItem>
            <MenuItem onClick={handleClose}>{t('account')}</MenuItem>
            <MenuItem onClick={handleClose}>{t('setting')}</MenuItem>
            <MenuItem onClick={handleChangeLanguage}>{locale == _GLOBAL.EN ? t('vn') : t('en')}</MenuItem>
            <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
          </Menu>
       
          {renderButtonAcction()}

          <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleCreateVideo();
                    },
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{t("addVideo")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {t("addText_category")} */}
                    </DialogContentText>

                    {/* Input for Video Name */}
                    <TextField
                        autoFocus
                        error={nameError}
                        helperText={nameErrorMessage}
                        onChange={(val) => setName(val.target.value)}
                        margin="dense"
                        id="name"
                        name="name"
                        label={t("name_video")}
                        type="text"
                        fullWidth
                        variant="outlined"
                        placeholder={t("name_video")}
                        style={{ marginBottom: 20 }}
                    />

                    {/* Input for Video Description */}
                    <TextField
                        error={descriptionError}
                        helperText={descriptionErrorMessage}
                        onChange={(val) => setDescription(val.target.value)}
                        margin="dense"
                        id="description"
                        name="description"
                        label={t("description_text")}
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        InputProps={{ style: { resize: 'vertical' } }}
                        style={{ marginBottom: 20 }}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6} >
                            {/* Khung chứa ảnh*/}
                            <Box
                                sx={{
                                    width: '250px',
                                    height: '150px',
                                    border: '2px dashed #3f51b5',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0',
                                    marginTop: 2
                                }}
                            >
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#999' }}>{t('Thumbnail')}</span>
                                )}
                            </Box>
                            {thumbnailError && (
                                <span style={{ color: 'red', display: 'block'}}>
                                    {thumbnailErrorMessage}
                                </span>
                            )}

                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item style={{

                              display: 'flex', justifyContent: 'flex-end', marginTop: "16px", marginRight:"30px" }}>
                                    <Autocomplete
                                        multiple
                                        options={categoryData}
                                        getOptionLabel={(option) => option.label}
                                        value={categoryOptions} // Giá trị hiện tại (các mục đã chọn)
                                        onChange={(event, newValue:any) => setCategoryOptions(newValue)} // Cập nhật state khi thay đổi
                                        renderInput={(params) => (
                                            <TextField {...params}
                                            label={t('add_to_category')}
                                            error={optionError}
                                            helperText={optionErrorMessage} />
                                        )}
                                        filterOptions={(options, state) =>
                                            options.filter(option =>
                                                option.label.toLowerCase().includes(state.inputValue.toLowerCase())
                                            )
                                        }
                                        style={{ width: 300 }}
                                        

                                    />
                                
                                    
                            </Grid>

                            <Grid item style={{ marginTop: '75px', justifyContent:"flex-end", display:"flex" }}>
                                {videoError ? (
                                    <span style={{ color: 'red', display: 'block', paddingTop: "18px" }}>
                                        {videoErrorMessage}
                                    </span>
                                ) : (
                                    videoFile && (
                                        <span style={{ color: 'black', display: 'block' }}>
                                            {videoFile.name}
                                        </span>
                                    )
                                )}
                            </Grid>
                        </Grid>

                        {/* </Grid> */}


                        {/* Cột nút chọn ảnh Thumbnail */}
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                startIcon={<PhotoCameraIcon />}
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '8px 16px',
                                }}
                            >
                                {t('Choose_thumbnail')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </Button>

                        </Grid>

                        {/* Cột nút chọn video */}
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                component="label"
                                startIcon={<VideoLibraryIcon />}
                                style={{
                                    padding: '8px 16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {t('upload_video')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileVideoChange}
                                    accept="video/*"
                                />
                            </Button>
                        </Grid>


                    </Grid>

                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>{t("btnCancel")}</Button>
                    <Button type="submit">{t("add")}</Button>
                </DialogActions>
  </Dialog>
          
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
               >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>


        </Toolbar>
      </AppBar>
    </Box>
  );
}

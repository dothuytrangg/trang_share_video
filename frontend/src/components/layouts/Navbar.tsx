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
  const themeMaster = useSelector((state: any) => state.master.theme); 
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
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =useState(false)
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("")
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  // const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState("");

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
      setNameErrorMessage(t("name_video_must_more_than_3_characters"));
      isValid = false;
    } else if (name.value.length > 70) {
      setNameError(true);
      setNameErrorMessage(t("name_video_must_least_than_70_characters"));
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
      setDescriptionErrorMessage(t("description_video_must_more_than_10_characters"));
      isValid = false;
    } else if (description.value.length > 300) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_video_must_least_than_300_characters"));
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
        setThumbnailError(false)
    }
};

const handleFileVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setVideoFile(file);
        console.log(file);
        setVideoError(false)

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

  const [searchTerm, setSearchTerm] = useState('');

  // Hàm gọi API tìm kiếm
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.length >= 1) {
      // Chuyển hướng đến trang tìm kiếm với từ khóa
      router.push(`/search?query=${searchTerm}`);
    }
  };





  const renderButtonAcction = () => {
    if (!isLogin) {
      return <Button sx={{color : themeMaster=== "light" ? '#111':'#fff',borderColor:themeMaster=== "light" ? '#111':'#fff'}} onClick={handleRedirectAuthenPage} variant="outlined" startIcon={<AccountCircle />}>
        {t('login')}
      </Button>
    } else {
      return (
        
        <Box >
          {/* <img src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${masterStore.user.avatar}`} ></img> */}
          <Button onClick={()=>setOpenAddDialog(true)} variant="outlined" style={{width:20,height:35,margin:10}}   sx={{color : themeMaster=== "light" ? '#111':'#fff',borderColor:themeMaster=== "light" ? '#111':'#fff'}} startIcon={<VideoCallOutlined style={{width:30,height:30}}
        
         
          />}>
          </Button>
           <Button onClick={handleClick} variant="outlined" sx={{color : themeMaster=== "light" ? '#111':'#fff',borderColor:themeMaster=== "light" ? '#111':'#fff'}}  startIcon={profileAvatar
      ? (<Avatar src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${profileAvatar}`} sx={{ width: 25, height: 25}}/>) 
      :(<AccountCircle sx={{ width: 25, height: 25}} />)}>
        {masterStore.user.name}
      </Button>

      
      
        </Box>
      )
      
    }


  }


  const updatePasswordValidateInputs = () => {
    let isValid = true;

    //kiểm tra trường old_password
    if(!oldPassword){
      setOldPasswordError(true)
      setOldPasswordErrorMessage(t("password_not_empty"))
      isValid = false;
    }
    // Kiểm tra trường password
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_not_empty')); // Mật khẩu không được để trống
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_least_6')); // Mật khẩu phải có ít nhất 6 ký tự
      isValid = false;
    } else if (password.length > 16) {
      setPasswordError(true);
      setPasswordErrorMessage(t('password_more_16')); // Mật khẩu không được quá 16 ký tự
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Kiểm tra trường confirm_password
    if (!confirm_password) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t('confirm_password_not_empty')); // Xác nhận mật khẩu không được để trống
      isValid = false;
    } else if (confirm_password.length < 6) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t('password_least_6')); // Xác nhận mật khẩu phải có ít nhất 6 ký tự
      isValid = false;
    } else if (confirm_password.length > 16) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t('password_more_16')); // Xác nhận mật khẩu không được quá 16 ký tự
      isValid = false;
    } else if (password !== confirm_password) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(t('password_not_match')); // Mật khẩu không khớp
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };



  const handleUpdatePassword = (userId: number) => {
    const valid: boolean = updatePasswordValidateInputs();

    if (valid) {

      const userData_update = {
        old_password: oldPassword,
        password,
        confirm_password
      };
      console.log('User data for password update:', userData_update);

      requestApi(`users/change-password/${userId}`, "PUT", userData_update)
        .then((res: any) => {
          console.log('res update password', res)
          if (res.success) {
            //  loadUsers(page);
            //  console.log('res update password',res)
            dispatch(updateLocalStorage());

            setOpenUpdateDialog(false);
            setSnackbarMessage(t("update_user_success"));
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          } else {
            setSnackbarMessage(res.message || t(("update_user_failed")));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        })
        .catch((err: any) => {
          console.error("Update user failed:", err.response?.data || err.message);
          setSnackbarMessage(t("update_user_occerred"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        });
    }
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch} 
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
            <MenuItem onClick={()=>setOpenUpdateDialog(true)}>{t('change_password')}</MenuItem>
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
                                                <span style={{ color: '#999' }}>{t('thumbnail')}</span>
                                            )}
                                        </Box>
                                       
                                            <span style={{ color: 'red', display: 'block'}}>
                                                {thumbnailError ? (thumbnailErrorMessage):("")}
                                            </span>
                                     

                                    </Grid>
                                    <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Grid item style={{
              
                                           display: 'flex', justifyContent: 'flex-end', marginTop: "16px", marginRight:"30px" }}>
                                                <Autocomplete
                                                    multiple
                                                    options={categoryData}
                                                    getOptionLabel={(option) => option.label}
                                                    value={categoryOptions} // Giá trị hiện tại (các mục đã chọn)
                                                    onChange={(event, newValue:any) => {
                                                      setCategoryOptions(newValue),
                                                      categoryOptions.length != null &&(
                                                        setOptionError(false),
                                                        setOptionErrorMessage("")
                                                      )
                                                    }} // Cập nhật state khi thay đổi
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                         label={t('add_to_category')}
                                                         error={optionError}
                                                         helperText={optionErrorMessage} />
                                                    )}
                                                    filterOptions={(options) =>
                                                      // Lọc ra các option chưa được chọn
                                                      options.filter(
                                                          (option) =>
                                                              !categoryOptions.some(
                                                                  (selectedOption:any) => selectedOption.id === option.id
                                                              )
                                                      )
                                                  }
                                                    style={{ width: 300 }}
                                                    

                                                />
                                             
                                                
                                        </Grid>

                                        <Grid item style={{ marginTop: '75px', justifyContent:"flex-end", display:"flex" }}>

                                          {videoError ? (<span style={{ color: 'red', display: 'block', paddingTop: "18px" }}>
                                                    {videoErrorMessage}
                                                </span>):(<span style={{ color: 'black', display: 'block' }}>
                                                        {videoFile &&(videoFile.name)}
                                                    </span>) }
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
          <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault(); 
            // console.log('user id',masterStore.user.id);
            handleUpdatePassword(masterStore.user.id);
       
          },
        }}
      >
            <DialogTitle>{t("change_password")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {/* {t("update_text")} */}
              </DialogContentText>
              <TextField
                error={oldPasswordError}
                helperText={oldPasswordErrorMessage}
                onChange={(val) => setOldPassword(val.target.value)}
                value={oldPassword}
                margin="dense"
                id="oldPassword"
                name="oldPassword"
                label={t("password")}
                type="password"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                error={passwordError} 
                helperText={passwordErrorMessage} 
                onChange={(val) => {
                  setPassword(val.target.value);  
                }}
                value={password}
                margin="dense"
                id="password"
                name="password"
                label={t("new_password")}
                type="password"
                fullWidth
                variant="standard"
              />

              <TextField
                autoFocus
                error={confirmPasswordError}  // Lỗi sẽ được hiển thị khi confirmPasswordError là true
                helperText={confirmPasswordErrorMessage}  // Thông báo lỗi hiển thị dưới trường input
                onChange={(val) => {
                  setConfirmPassword(val.target.value);  // Cập nhật giá trị confirm_password
                }}
                value={confirm_password}
                margin="dense"
                id="confirm_password"
                name="confirm_password"
                label={t("confirm_password")}
                type="password"
                fullWidth
                variant="standard"
              />
            </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
          <Button type="submit" >{t("btnUpdate")}</Button>
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

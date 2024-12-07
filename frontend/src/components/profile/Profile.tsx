'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Avatar, IconButton, Button, Typography, Snackbar, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Paper, CardMedia, CardActions, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch } from '@/stores/hookStore';
import requestApi from '../../../helpers/api';
import { _ENV } from '@/contstants';
import { useLocale, useTranslations } from 'next-intl';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { updateLocalStorage } from '@/stores/features/masterSlice';
import { useRouter } from 'next/navigation';

const Profile= () => {
  // const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const [profileData,setProfileData] = useState<any>({});
  const [videos,setVideos] = useState([]);
  const dispatch = useAppDispatch();
  var ranonce = false;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const router = useRouter();

  const handleImageChange = (event:any) => {
      if(event.target.files[0]){
        const file = event.target.files[0]
        let reader = new FileReader();
        reader.onload = (e)=>{
          setProfileData({
            ...profileData,avatar:reader.result,file:file
          })
        }
        reader.readAsDataURL(file)
      }
  };

  useEffect(() => {
    loadUser();
    setLoading(false);
}, [])
 

  const handleUploadAvatar = () =>{
    let formData = new FormData();
    formData.append('avatar',profileData.file);
    requestApi('users/upload-avatar','POST',formData,'json','multipart/form-data').then((res:any) =>{
      console.log('res',res);
      if(res.success){
         console.log('upload success !!')
         setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/avatars/'+  res.data.avatar})
         dispatch(updateLocalStorage({...res}));
         loadUser();
         setSnackbarMessage("upload avatar successfully");
         setSnackbarSeverity("success");
         setOpenSnackbar(true);
      }else{
          setSnackbarMessage(res.message ? (`${locale}`=== 'en'?'Only accept image files with extensions .jpg, .png, .jpeg, webp'
            :'Chỉ chấp nhận file ảnh có đuôi .jpg,.png,.jpeg,webp'):res.message);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
      }
    }).catch((err:any)=>{
       console.log('err',err);
        setSnackbarMessage(("upload avatar failed"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
    })
    
  }

  const loadUser = async () => {

    await requestApi('users/profile','GET').then((res: any) => {
      console.log('res user', res);
      if (res.success) {
              setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/avatars/'+  res.data.avatar})
              // setProfileData({...res.data,avatar:_ENV.NEXT_URL_LOCAL+ '/avatars/'+  res.data.avatar})
              setVideos(res.data.videos);
              
              
            // setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/avatars/'+  res.data.avatar})

           
        

      }

    }).catch((err: any) => {
      console.error(err);
    })
  
  };
  // useEffect(()=>{
   
  //     loadUser();
  //     setLoading(false);
    
   

  // },[])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);



  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [status, setStatus] = useState("confirming");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const handleOpenUpdateDialog = (video: any) => {
      console.log('video user', video);
      setSelectedVideo(video);
      console.log('sss',selectedVideo)
      // console.log(selectedVideo);
      setName(video.name);
      setDescription(video.description);
      setThumbnailFile(null);
      // setThumbnailPreview(`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`);
      setThumbnailPreview(`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`);
      // console.log('console thumbnail',selectedVideo.thumbnail);

      // console.log('thumbnailFile',thumbnailFile);
      setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
      setOpenUpdateDialog(false);
      setThumbnailPreview(null);
  };

  const validateUpdateInputs = () => {
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
  
   
    // if (!thumbnailFile) {
    //   setThumbnailError(true)
    //   setThumbnailErrorMessage(t("thumbnail_required"))
    //   isValid = false;
    // }

    // if (!videoFile) {
    //   setVideoError(true)
    //   setVideoErrorMessage(t("video_required"))
    //   isValid = false;
    // }
  
    return isValid;
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        console.log(event.target.files);
        const file = event.target.files[0];
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    }
};
  
  
    const handleUpdateVideo = (VideoId: string,thumbnail:File) => {
      const valid: boolean = validateUpdateInputs();
      console.log(valid)
      
    
      if (valid && thumbnail) {
        
    
        console.log('hehhh');
    
        const slug = slugify(name);
        const formData = new FormData();
        if (thumbnailFile) {
          console.log('thumbnail',thumbnailFile);
          
          formData.append("thumbnail", thumbnailFile); 
        } else {
            
          formData.append("thumbnail", thumbnail);
        }
        // formData.append("status", status);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("slug", slug);
        // formData.append("url", videoFile);
        
        console.log('form data',formData);
       
        // requestApi(`categories/${categoryId}`, "PUT", CategoryData_update)
    
        requestApi(`videos/${VideoId}`, "PUT", formData)
          .then((res: any) => {
            // console.log('res update video',formData);
            if (res.success) {
              loadUser()
              // // console.log('res update video', res)
              dispatch(updateLocalStorage());
             
              setOpenUpdateDialog(false);
              setSnackbarMessage(t("update_video_success"));
              setSnackbarSeverity("success");
              setOpenSnackbar(true);
            } else {
              setSnackbarMessage(res.message || t("update_video_failed"));
              setSnackbarSeverity("error");
              setOpenSnackbar(true);
            }
          })
          .catch((err: any) => {
            console.error("Update category failed:", err.response?.data || err.message);
            setSnackbarMessage(t("update_video_occerred"));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          });
      }else{
        console.log('id',VideoId)
        console.log('update error')
      }
    };

    
    const handleDeleteVideo = (videoId: string) => {

     
      requestApi(`videos/${videoId}`, "DELETE")
      .then((res: any) => {

        if (res.success) {
          loadUser()
          // console.log("Video deleted:", res);
          setSnackbarMessage(t("delete_video_success"));
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          // setOpenConfirmDialog(false)
     
        } else {
          console.error("Delete video failed:", res.message);
          setSnackbarMessage(res.message || t("delete_video_failed"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Delete video failed:", err.response?.data || err.message);
        setSnackbarMessage(t("delete_video_occerred"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
     

      

    };
    const handleOnClick = (videoId: string) => {
      router.push(`/${locale}/detail/${videoId}`);
    };


  const renderPage = () => {
    if (!loading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <React.StrictMode>

                        <Dialog
                          open={openUpdateDialog}
                            onClose={() => handleCloseUpdateDialog()}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                    event.preventDefault();
                                    handleUpdateVideo(selectedVideo.id, selectedVideo.thumbnail);

                                },
                            }}
                        >
                            <DialogTitle>{t("update_video")}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {/* {t("update_caterogy_text")} */}
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    error={nameError}
                                    helperText={nameErrorMessage}
                                    onChange={(val) => {
                                        setName(val.target.value);
                                    }}
                                    value={name}
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label={t("name_video")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    placeholder={t("name_video")}
                                />
                                <TextField
                                    autoFocus
                                    error={descriptionError}
                                    helperText={descriptionErrorMessage}
                                    onChange={(val) => {
                                        setDescription(val.target.value);
                                    }}
                                    value={description}
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label={t("description_text")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />

                                <Button variant="outlined" component="label">
                                    {t('Choose_thumbnail')}
                                    <input
                                        type="file"
                                        hidden
                                        // accept="image/*"
                                        onChange={handleFileChange}


                                    />
                                </Button>
                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        style={{ marginTop: 10, width: '60%', height: 'auto', maxHeight: '200px' }}
                                    />
                                )}
                         



                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
                                <Button type="submit" >{t("btnUpdate")}</Button>
                            </DialogActions>
                        </Dialog>
            <Card sx={{ maxWidth: 345, textAlign: 'center', padding: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('profile')}
                </Typography>
                <Avatar
                  src={profileData.avatar ? profileData.avatar :""}
                  alt="Profile Picture"
                  sx={{ width: 100, height: 100, margin: '0 auto 16px' }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleImageChange}
                  
                />
              
                <label htmlFor="avatar-upload">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography variant="body2" color="textSecondary">
                  {t('click_the_camera_to_upload_a_new_avatar')}
                </Typography>
                <Button onClick={handleUploadAvatar} variant="outlined" color="primary" >{t('update')}</Button>
              </CardContent>
              </Card>

                                    

                <div className="grid grid-cols-4 gap-3 mt-4"style={{}}>
                {
            videos.map((video:any)=>(
              <Card key={video.id} sx={{ maxWidth: 345,my:2 }}>
              <CardMedia
                sx={{ height: 140 }}
                // image={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`} 
                image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`} 
                title="green iguana"
              />
              <CardContent  sx={{ height: 140 }}>
              <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
                {video.name.length > 50 ? (
                  <Tooltip title={video.name}>
                    <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{`${video.name.substring(0, 50)}...`}</span>
                  </Tooltip>
                ) :
                  <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{video.name}</span>
                }
              </Typography>
                <Typography variant="body2" color="text.secondary" >
                {video.description.length > 100 ? `${video.description.substring(0,100)}...`:video.description}
                </Typography>

               
              </CardContent>
         

        <CardActions>
          
          <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained" size="small" onClick={()=>{handleOpenUpdateDialog(video)}} >{t('edit')}</Button>
          <Button  sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained" size="small"  onClick={()=>handleDeleteVideo(video.id)}>{t('delete')}</Button>

          {/* Hiển thị trạng thái */}
          <Typography
                      variant="body2"
                      color={video.status === "confirmed" ? "green" : "#dc143c"}
                      sx={{ mt: 2, fontWeight: "bold"}}
                      style={{marginLeft:70}}
                    >

                  {video.status === "confirmed" ? t("Confirmed") : t("Confirming")}
                </Typography>
      
          
        </CardActions>
        
  
      </Card>
      
      ))
       
     }
      {/* <Stack spacing={2}>
          <Pagination style={{ margin: 10 }} count={lastPage} page={page} onChange={handleChange} variant="outlined" color="primary" />

      </Stack> */}
    {/* {renderItemExample()} */}
      

   
        </div>
        <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
               >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>

          </React.StrictMode>
        </div>
      );
    }
  };

  return renderPage();

};

export default Profile;

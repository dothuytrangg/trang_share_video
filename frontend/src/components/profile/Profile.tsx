'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Avatar, IconButton, Button, Typography, Snackbar, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Paper, CardMedia, CardActions, Menu, MenuItem } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch } from '@/stores/hookStore';
import requestApi from '../../../helpers/api';
import { _ENV } from '@/contstants';
import { useLocale, useTranslations } from 'next-intl';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

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

 

  const handleUploadAvatar = () =>{
    let formData = new FormData();
    formData.append('avatar',profileData.file);
    requestApi('users/upload-avatar','POST',formData,'json','multipart/form-data').then((res:any) =>{
      console.log('res',res);
      if(res.success){
         console.log('upload success !!')
        //  setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/avatars/'+  res.data.avatar})
         loadUser();
         setSnackbarMessage("upload avatar successfully");
         setSnackbarSeverity("success");
         setOpenSnackbar(true);
      }else{
          setSnackbarMessage(("upload avatar failed"));
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
              setVideos(res.data.videos);
              
            // setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/avatars/'+  res.data.avatar})

           
        

      }

    }).catch((err: any) => {
      console.error(err);
    })
    // console.log(check)
    // setCategories(check.data);
    // console.log('category hhh',categories);
  };
  useEffect(()=>{
    if (!ranonce) {
      loadUser();
      setLoading(false);
    
    }
    ranonce = true;

  },[])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);



  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const renderPage = () => {
    if (!loading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <React.StrictMode>
          <Card sx={{ maxWidth: 345, textAlign: 'center', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Profile
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
          Click the camera to upload a new avatar
        </Typography>
        {/* {console.log('profileData',videos)} */}
        {/* <img src="http://localhost:2070/avatars/1730118918830-o_cam_chia_5_an_toan_va_tien_loi.jpg"></img> */}
       {/* <img src="https://nextcloud.congcucuatoi.com/remote.php/dav/files/trang/avatars/1730048688091-z4550394229796_c3ccf594bdb60930a3e60bf95305f9ad.jpg"></img> */}
        <Button onClick={handleUploadAvatar} variant="outlined" color="primary" >update</Button>
      </CardContent>
      </Card>

                            

          <div className="grid grid-cols-4 gap-3 mt-4"style={{}}>
          {
      videos.map((video:any)=>(
        <Card key={video.id} sx={{ maxWidth: 345,my:2 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`} 
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{fontSize:18}}>
           {video.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {video.description}
          </Typography>
        </CardContent>
         

        <CardActions>
          <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained" size="small">Share</Button>
          <Button  sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        color="inherit"
        variant="contained" size="small">Learn More</Button>

     <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
        style={{marginLeft:90}}
        
      >   
        <MoreVertOutlinedIcon />
      </IconButton>
      <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}

            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem className="px-5">Edit</MenuItem>
            <MenuItem onClick={handleClose}>Delete</MenuItem>
         
          </Menu>
          
      
          
        </CardActions>
  
      </Card>
      
      ))
       
     }
      {/* <Stack spacing={2}>
          <Pagination style={{ margin: 10 }} count={lastPage} page={page} onChange={handleChange} variant="outlined" color="primary" />

      </Stack> */}
    {/* {renderItemExample()} */}
      

   
        </div>

          </React.StrictMode>
        </div>
      );
    }
  };

  return renderPage();

};

export default Profile;

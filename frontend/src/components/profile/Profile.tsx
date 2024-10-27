'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Avatar, IconButton, Button, Typography, Snackbar, Alert } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch } from '@/stores/hookStore';
import requestApi from '../../../helpers/api';
import { _ENV } from '@/contstants';

const Profile= () => {
  // const [selectedImage, setSelectedImage] = useState(null);
  
  const [profileData,setProfileData] = useState<any>({});;
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

  useEffect(()=>{
    if (!ranonce) {
     requestApi('users/profile','GET').then((res:any)=>{
        if(res.success){
            // setProfileData({...res.data,avatar:_ENV.NEXT_URL_LOCAL+ '/'+  res.data.avatar})
            setProfileData({...res.data,avatar:_ENV.NEXT_URL_RESOURCE+ '/'+  res.data.avatar})
        }

     }

     ).catch((err)=>{
      console.log('err',err);
     })
     
      ranonce = true;
    }

  },[])

  return (
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
        {/* <img src="file:///E:/2.Documents/KLTN/trang_share_video/backend/uploads/avatars/1730049494371-ti.jpg"></img> */}
       {/* <img src="https://nextcloud.congcucuatoi.com/remote.php/dav/files/trang/avatars/1730048688091-z4550394229796_c3ccf594bdb60930a3e60bf95305f9ad.jpg"></img> */}
        <Button onClick={handleUploadAvatar} variant="outlined" color="primary" >update</Button>
      </CardContent>
      <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                  {snackbarMessage}
                </Alert>
          </Snackbar>
    </Card>
              
           
  );
};

export default Profile;

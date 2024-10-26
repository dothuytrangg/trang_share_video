'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Avatar, IconButton, Button, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch } from '@/stores/hookStore';
import requestApi from '../../../helpers/api';
import { _ENV } from '@/contstants';

const Profile= () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [profileData,setProfileData] = useState<any>({});;
  const dispatch = useAppDispatch();
  var ranonce = false;


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
      }
    }).catch((err:any)=>{
       console.log('err',err);
    })
    
  }

  useEffect(()=>{
    if (!ranonce) {
     requestApi('users/profile','GET').then((res:any)=>{
        if(res.success){
            setProfileData({...res.data,avatar:'http://localhost:2070'+'/'+  res.data.avatar})
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
        <Button onClick={handleUploadAvatar} variant="outlined" color="primary" >update</Button>
      </CardContent>
    </Card>
  );
};

export default Profile;

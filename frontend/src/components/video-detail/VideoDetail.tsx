'use client';

import React, { useEffect, useState } from "react";

import requestApi from "../../../helpers/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Grid, Typography, Avatar, Button, IconButton, TextField } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './VideoDetail.module.css';
import SortIcon from '@mui/icons-material/Sort';
import ListItem from '@mui/material/ListItem';
import { useAppDispatch, useAppSelector } from '@/stores/hookStore';
import { closeDrawer } from '@/stores/features/masterSlice';
import { _ENV } from "@/contstants";
import ProposeVideo from "@/components/video-detail/propose/ProposeVideo";



const VideoDetail = () => {
  const router = useRouter();
  const { videoId } = useParams(); 
  const searchParams = useSearchParams(); // Dùng để lấy query params
  const categoryId = searchParams.get("categoryId"); // Lấy categoryId từ URL
  const [videoData, setVideoData] = useState<any>(null);
  const [proposeVideoData, setProposeVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (videoId) {

      fetchVideoDetail();
      
    }

  }, [videoId]);

  const fetchVideoDetail = async () => {
    
    await requestApi(`videos/${videoId}`,'GET').then((res: any) => {
      // console.log('res one',res)
      if (res.success) {

        setVideoData(res.data) 
        // setUserData(res.data.user); 

      }

    }).catch((err: any) => {
      console.error(err);
    })
    setLoading(false)
  
     
  };
  useEffect(() => {
    if (categoryId) {
      fetchVideoDetailByCategoryId();
    }
  }, [categoryId]);

  const fetchVideoDetailByCategoryId = async () => {
    
    await requestApi(`video-details/${categoryId}`,'GET').then((res: any) => {
      console.log("Videos by Category:", res.data);
      if (res.success) {
        setProposeVideoData(res.data);
         
      }

    }).catch((err: any) => {
      console.error(err);
    })

    setLoading(false)
  
     
  };
  // const [isPlaying, setIsPlaying] = useState(true);

// const togglePlay = () => {
//   const videoElement = document.querySelector(".styles_videoPlayer__1");
//   if (videoElement) {
//     if (isPlaying) {
//       videoElement.pause();
//     } else {
//       videoElement.play();
//     }
//     setIsPlaying(!isPlaying);
//   }
// };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  


  if (!videoData) {
    return <div>Video not found</div>;
  }

  return (
    <Box className={styles.container}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
        <div className={styles.videoWrapper}>
          <video
            className={styles.videoPlayer}
            src={`${_ENV.NEXT_URL_LOCAL}/videos/${videoData.url}`}
            autoPlay
            muted
            loop
            playsInline
          ></video>
        </div>
          <h1 className={styles.videoTitle}>{videoData.name}</h1>
          <Box className={styles.channelInfo}>
            <Avatar src={`${_ENV.NEXT_URL_LOCAL}/avatars/${videoData.user.avatar}`}  alt = 'akelo'/>
            <Box className={styles.channelText}>
              <Typography variant="subtitle1">{videoData.user.full_name}</Typography>
              <Typography variant="body2" color="textSecondary">3,89 N người đăng ký</Typography>
            </Box>
            <Button variant="contained" color="primary" className={styles.subscribeButton}>
              Đăng ký
            </Button>
          </Box>
          <Box className={styles.videoButton}>
            <Button startIcon={<ThumbUpOutlinedIcon />}>{videoData.likes}</Button>
            <Button startIcon={<ThumbDownOutlinedIcon />}>{videoData.dislike}</Button>
            <Button startIcon={<ShareOutlinedIcon />}>Chia sẻ</Button>
            <IconButton><MoreHorizIcon /></IconButton>
          </Box>
          <Box className={styles.videoInfo}>
            <Typography variant="body2">{videoData.viewed} views • 3 weeks ago • #16 on Trending for music</Typography>
            <Typography variant="body2">
              {videoData.description}
              {/* <a href="#">http://GagaMars.lnk.to/DieWithASmile</a> */}
            </Typography>
            <Typography variant="body2">Directed by Daniel Ramos & Bruno Mar...</Typography>
          </Box>

          <Box  style={{ height: "100%", overflow: "hidden" }}>
            {/* <Typography variant="h6">74,731 Comments</Typography> */}
            <Button startIcon={<SortIcon />}>Sort by</Button>

            <Box className={styles.addComment}>
              <Avatar>U</Avatar>
              <TextField fullWidth placeholder="Add a comment..." variant="standard" />
              <Button variant="text">Cancel</Button>
              <Button variant="text" disabled>Comment</Button>
            </Box>
          </Box> 

        </Grid>
        <ProposeVideo proposeVideoData={proposeVideoData} videoData={videoData} categoryId={categoryId}/>


      </Grid>
      
    </Box>
  );
};


export default VideoDetail;

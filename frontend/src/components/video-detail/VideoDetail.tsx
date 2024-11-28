'use client';

import React, { useEffect, useRef, useState } from "react";

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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";



const VideoDetail = () => {
  const router = useRouter();
  const { videoId } = useParams();
  const searchParams = useSearchParams(); // Dùng để lấy query params
  const categoryId = searchParams.get("categoryId"); // Lấy categoryId từ URL
  const [videoData, setVideoData] = useState<any>(null);
  const [proposeVideoData, setProposeVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true); // Điều khiển ẩn/hiện nút
  const [isMuted, setIsMuted] = useState(false); // Trạng thái âm thanh
  // const [userData, setUserData] = useState([]);
  var ranonce = false;
  useEffect(() => {
    if (!ranonce) {
      if (videoId) {

        fetchVideoDetail();
      }
      if (categoryId) {
        fetchVideoDetailByCategoryId();
      }
      ranonce = true;
    }

  }, [videoId, categoryId]);

  const fetchVideoDetail = async () => {

    await requestApi(`videos/${videoId}`, 'GET').then((res: any) => {
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




  const fetchVideoDetailByCategoryId = async () => {

    await requestApi(`video-details/${categoryId}`, 'GET').then((res: any) => {
      // console.log("Videos by Category:", res.data);
      if (res.success) {
        setProposeVideoData(res.data);

      }

    }).catch((err: any) => {
      console.error(err);
    })

    setLoading(false)


  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      // Nếu video đang phát -> Pause
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Nếu video đang dừng -> Play
        videoRef.current.play();

        // Khi video được phát lần đầu, bật âm thanh nếu đang tắt
        if (videoRef.current.muted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
      }

      setIsPlaying(!isPlaying);
    }
  };


  useEffect(() => {
    if (showControls) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showControls]);

  // Hiển thị nút khi hover vào video
  const handleMouseEnter = () => {
    setShowControls(true);
  };

  // Hàm bật/tắt âm thanh
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };




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
          {/* <div className={styles.videoWrapper}>
          <video
            className={styles.videoPlayer}
            src={`${_ENV.NEXT_URL_LOCAL}/videos/${videoData.url}`}
            autoPlay
            muted
            loop
            playsInline
          ></video>
        </div> */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              aspectRatio: "16/9",
              position: "relative",
              backgroundColor: "#000",
              overflow: "hidden",
            }}

            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowControls(false)} // Ẩn nút khi rời chuột
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className={styles.videoPlayer}
              src={`${_ENV.NEXT_URL_RESOURCE}/videos/${videoData.url}`}
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Play/Pause Button */}
            {showControls && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  cursor: "pointer",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                }}
                onClick={togglePlayPause}
              >
                <IconButton
                  sx={{
                    color: "#fff",
                    fontSize: "2rem",
                  }}
                  className={styles.overlayButton}

                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
              </Box>
            )}

            {/* Nút Âm Thanh */}
            {showControls && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 10,
                }}
              >
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    },
                  }}
                >

                  {isMuted ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
                </IconButton>
              </Box>
            )}
          </Box>



          <h1 className={styles.videoTitle}>{videoData.name}</h1>
          <Box className={styles.channelInfo}>
            <Avatar src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${videoData.user.avatar}`} alt='akelo' />
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

          <Box style={{ height: "100%", overflow: "hidden" }}>
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
        <ProposeVideo proposeVideoData={proposeVideoData} videoData={videoData} categoryId={categoryId} />


      </Grid>

    </Box>
  );
};


export default VideoDetail;

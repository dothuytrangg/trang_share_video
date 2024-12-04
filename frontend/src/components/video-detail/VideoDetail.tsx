'use client';

import React, { useEffect, useRef, useState } from "react";

import requestApi from "../../../helpers/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Grid, Typography, Avatar, Button, IconButton, TextField, Slider } from '@mui/material';
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
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Forward10Icon from "@mui/icons-material/Forward10";
import Replay10Icon from "@mui/icons-material/Replay10";
import { useSelector } from 'react-redux';




const VideoDetail = () => {
  const router = useRouter();
  const { videoId } = useParams();

  const searchParams = useSearchParams(); // Dùng để lấy query params
  const categoryId = searchParams.get("categoryId"); // Lấy categoryId từ URL
  const [videoData, setVideoData] = useState<any>(null);
  const [proposeVideoData, setProposeVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true); // Điều khiển ẩn/hiện nút
  // const [userData, setUserData] = useState([]);
  const [likes, setLikes] = useState([])

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

    await requestApi(`videos/${videoId}`, 'GET')
    .then((res: any) => {
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

  const handleLike = () => {
    // Bật trạng thái loading khi bắt đầu thao tác
   // setLoading(true);

    // Gọi API profile để lấy thông tin người dùng (userId)
    requestApi('users/profile', 'GET')
      .then((userResponse: any) => {
        if (userResponse.success) {
          const userId = userResponse.data.id;  // Lấy userId từ thông tin trả về

          console.log("videoId", videoId);
          console.log("userId", userId);

          // Gọi API để like video
          return requestApi(`playlist-like/${userId}/${videoId}`, 'POST');
        } else {
          console.error("Không thể lấy thông tin người dùng");
          return Promise.reject("Không thể lấy thông tin người dùng");
        }
      })
      .then((likeResponse: any) => {
        // Kiểm tra kết quả từ API like
        if (likeResponse.success) {
          setLikes(likeResponse.data);  // Cập nhật lại số lượt thích
        } else {
          console.error("Không thể like video");
        }
      })
      .catch((err: any) => {
        console.error("Lỗi khi thực hiện like:", err);
      })
      .finally(() => {
        // Tắt trạng thái loading khi thao tác hoàn thành
       // setLoading(false);
      });
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

 // Toggle play/pause
 const togglePlayPause = () => {
  if (videoRef.current) {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};

// Handle mute/unmute
const toggleMute = () => {
  if (videoRef.current) {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }
};

// Handle volume change
const handleVolumeChange = (e: Event, value: number | number[]) => {
  const newVolume = Array.isArray(value) ? value[0] : value;
  setVolume(newVolume);
  if (videoRef.current) {
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  }
};

// Update progress bar
useEffect(() => {
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const video = videoRef.current;
  video?.addEventListener("timeupdate", handleTimeUpdate);
  return () => {
    video?.removeEventListener("timeupdate", handleTimeUpdate);
  };
}, []);

// Seek video
const handleSeek = (e: Event, value: number | number[]) => {
  const newProgress = Array.isArray(value) ? value[0] : value;
  if (videoRef.current) {
    videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
    setProgress(newProgress);
  }
};

// Fullscreen toggle
const toggleFullscreen = () => {
  if (videoRef.current) {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }
};

// Zoom functionality
const handleZoom = (zoomIn: boolean) => {
  const newZoom = zoomIn ? zoomLevel + 0.1 : zoomLevel - 0.1;
  setZoomLevel(Math.max(1, newZoom));
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
        position: "relative",
        width: "100%",
        maxWidth: 800,
        aspectRatio: "16/9",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={`${_ENV.NEXT_URL_RESOURCE}/videos/${videoData.url}`}
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${zoomLevel})`,
          objectFit: "cover",
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
      />

      {/* Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          right: 10,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {/* Play/Pause */}
        <IconButton onClick={togglePlayPause} color="inherit">
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        {/* Rewind */}
        <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} color="inherit">
          <Replay10Icon />
        </IconButton>

        {/* Progress */}
        <Slider
          value={progress}
          onChange={handleSeek}
          aria-labelledby="progress-slider"
          sx={{ flex: 1, mx: 2 }}
        />

        {/* Forward */}
        <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} color="inherit">
          <Forward10Icon />
        </IconButton>

        {/* Volume */}
        <IconButton onClick={toggleMute} color="inherit">
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          step={0.1}
          min={0}
          max={1}
          sx={{ width: 100 }}
        />

        {/* Fullscreen */}
        <IconButton onClick={toggleFullscreen} color="inherit">
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>

        {/* Zoom */}
        {/* <IconButton onClick={() => handleZoom(true)} color="inherit">
          <ZoomInIcon />
        </IconButton>
        <IconButton onClick={() => handleZoom(false)} color="inherit">
          <ZoomOutIcon />
        </IconButton> */}
      </Box>
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
            <Button startIcon={<ThumbUpOutlinedIcon />} onClick={handleLike}>{videoData.likes}</Button>
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

'use client';

import React, { useEffect, useRef, useState } from "react";

import requestApi from "../../../helpers/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Grid, Typography, Avatar, Button, IconButton, TextField, Slider, useMediaQuery } from '@mui/material';
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
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { Flag } from "@mui/icons-material";



const VideoDetail = () => {
  const router = useRouter();
  const { videoId } = useParams();
  const searchParams = useSearchParams(); // Dùng để lấy query params
  const categoryId = searchParams.get("categoryId"); // Lấy categoryId từ URL
  const [videoData, setVideoData] = useState<any>(null);
  const [proposeVideoData, setProposeVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useSelector((state: any) => state.master.theme); 
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const [hasReachedHalf, setHasReachedHalf] = useState(false);
  const masterStore = useAppSelector((state: any) => state.master);
  const isMobile = useMediaQuery('(max-width:600px)');

    
  // const [userData, setUserData] = useState([]);
  // var ranonce = false;
  // useEffect(() => {
  //   if (!ranonce) {
  //     if (videoId) {

  //       fetchVideoDetail();
  //     }
  //     if (categoryId) {
  //       fetchVideoDetailByCategoryId();
  //     }
  //     ranonce = true;
  //   }

  // }, [videoId, categoryId]);a

  const isInitialRender = useRef(true);



  useEffect(() => {
    // Lấy tham chiếu video
    const video = videoRef.current;
    // console.log("videoRef.current", videoRef.current);
  
    // Cờ để ngăn fetch lại dữ liệu ở lần render đầu tiên
    if (isInitialRender.current) {
      if (videoId) {
        fetchVideoDetail();
      }
      if (categoryId) {
        fetchVideoDetailByCategoryId();
      }
      isInitialRender.current = false;
    }
  
    // Reset timeout để ẩn controls
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
  
    resetControlsTimeout();
  
    // Hàm xử lý cập nhật tiến trình video
    var flag = false;
    const handleTimeUpdate = () => {
      if (video) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        setProgress((currentTime / duration) * 100);
          // Kiểm tra nếu đã xem đến 1/2 và chưa gửi yêu cầu
          if (!flag&&!hasReachedHalf && currentTime >= duration / 2) {
            setHasReachedHalf(true); // Đánh dấu đã xem qua 1/2
            updateViewCount(); // Gọi hàm tăng lượt xem
            // if(masterStore.is_login){
            //   createHistory()
            // }
            flag = true
          }
         
      }
    };
  
    // Gán sự kiện cho video
    video?.addEventListener("timeupdate", handleTimeUpdate);
  
    // Cleanup khi component unmount
    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoId, categoryId,videoData]); // Dependencies chỉ cần là các tham số ảnh hưởng đến logic
  
  const updateViewCount = async () => {
  
      await requestApi(`videos/${videoId}/view`, "PATCH").then((res:any)=>{
         if(res.success){
          console.log("View count updated successfully");
         }else{
          console.error("Failed to update view count");
         }
      }).catch((err:any)=>{
        console.error("Error updating view count:", err);
      })
   
  };

//   const createHistory = async () => {
  
//     await requestApi(`histories/${videoId}`, "POST").then((res:any)=>{
//        if(res.success){
//         console.log("history save successfully");
//        }else{
//         console.error("Failed  save history");
//        }
//     }).catch((err:any)=>{
//       console.error("Error history:", err);
//     })
 
// };



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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);


  // Reset controls timeout
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };



  const handleMouseOver = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  const handleMouseLeave = () => {
    resetControlsTimeout();
  };

  

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


const handleSeek = (e: Event, value: number | number[]) => {
  const newProgress = Array.isArray(value) ? value[0] : value;
  if (videoRef.current) {
    videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration; 
    setProgress(newProgress); // Đồng bộ trạng thái progress
  }
};

// Fullscreen toggle
const toggleFullscreen = () => {
  if (videoRef.current) {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
     
    } else {
      document.exitFullscreen();
      // setIsFullscreen(false);
      // setIsFullscreen(!isFullscreen);
    }
    // setIsFullscreen(!isFullscreen);
  }
};



const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
};
const formatDateTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), "dd/MM/yyyy HH:mm:ss");
  } catch (error) {
    console.error("Invalid date format:", isoString, error);
    return 'invalid_date';
  }
};


  if (loading) {
    return <div>Loading...</div>;
  }



  if (!videoData) {
    return <div>Video not found</div>;
  }



  return (
    <Box  sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
        <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? '100%' : '800px',
              // maxHeight:500,
              aspectRatio: "16/9",
              backgroundColor: "#000",
              overflow: "hidden",
            }}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Element */}
            <video

              ref={videoRef}
              src={`${_ENV.NEXT_URL_RESOURCE}/videos/${videoData.url}`}
              style={{
                width: "100%",
                height: "100%",
                // transform: `scale(${zoomLevel})`,
                objectFit: "contain",
              }}
              autoPlay 
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onPlay={() => setIsPlaying(true)} 
              onPause={() => setIsPlaying(false)} 
            />

          
            {showControls && (
              <IconButton
                onClick={togglePlayPause}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>
            )}

  
            {showControls && (
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
          
              <IconButton onClick={togglePlayPause} 
              sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}
         
              >
                {isPlaying ? <PauseIcon  sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }} /> : <PlayArrowIcon 
              sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}/>}
              </IconButton>

              {/* Rewind */}
              <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}  sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}>
                <Replay10Icon />
              </IconButton>

              <Slider
              value={progress}
              onChange={handleSeek}
              aria-labelledby="progress-slider"
              sx={{ flex: 1, mx: 2 }}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="on"
              valueLabelFormat={(value) =>
                duration > 0 ? formatTime((value / 100) * duration) : "0:00"
              }
            />

              {/* Forward */}
              <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} 
                 sx={{
                  color:theme === "light" ? '#FFF': '#fff'
                }}>
                <Forward10Icon />
              </IconButton>

              {/* Volume */}
              <IconButton onClick={toggleMute}  sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}>
                {isMuted ? <VolumeOffIcon  sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}/> : <VolumeUpIcon  sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}/>}
              </IconButton>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                step={0.1}
                min={0}
                max={1}
                sx={{ width: 100
                 }}
             
                
              />

              {/* Fullscreen */}
              <IconButton onClick={toggleFullscreen} 
               sx={{
                color:theme === "light" ? '#FFF': '#fff'
              }}>
                {isFullscreen ? <FullscreenExitIcon  /> : <FullscreenIcon />}
              </IconButton>

         
            </Box>)}
      </Box>
           


          <h1 className={styles.videoTitle}>{videoData.name}</h1>
          <Box className={styles.channelInfo}>
            <Avatar src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${videoData.user.avatar}`} alt='akelo' />
            <Box className={styles.channelText}>
              <Typography variant="subtitle1">{videoData.user.full_name}</Typography>
              {/* <Typography variant="body2" color="textSecondary">3,89 N người đăng ký</Typography> */}
            </Box>
            {/* <Button variant="contained" color="primary" className={styles.subscribeButton}>
              Đăng ký
            </Button> */}
          </Box>
          {/* <Box className={styles.videoButton}>
            <Button startIcon={<ThumbUpOutlinedIcon />}>{videoData.likes}</Button>
            <Button startIcon={<ThumbDownOutlinedIcon />}>{videoData.dislike}</Button>
            <Button startIcon={<ShareOutlinedIcon />}>Chia sẻ</Button>
            <IconButton></IconButton>
          </Box> */}
          <Box className={styles.videoInfo}>
            <Typography variant="body2">{videoData.viewed} {t('views')} • 
             {t('posted_date')}: {formatDateTime(videoData.created_at)}</Typography>
            <Typography variant="body2">
              {videoData.description}
              {/* <a href="#">http://GagaMars.lnk.to/DieWithASmile</a> */}
            </Typography>
         
          </Box>

          {/* <Box style={{ height: "100%", overflow: "hidden" }}>
            <Typography variant="h6">74,731 Comments</Typography>
            <Button startIcon={<SortIcon />}>Sort by</Button>

            <Box className={styles.addComment}>
              <Avatar>U</Avatar>
              <TextField fullWidth placeholder="Add a comment..." variant="standard" />
              <Button variant="text">Cancel</Button>
              <Button variant="text" disabled>Comment</Button>
            </Box>
          </Box> */}

        </Grid>
        <Grid item xs={12} md={4} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <ProposeVideo proposeVideoData={proposeVideoData} videoData={videoData} categoryId={categoryId} />
        </Grid>


      </Grid>

    </Box>
  );
};


export default VideoDetail;

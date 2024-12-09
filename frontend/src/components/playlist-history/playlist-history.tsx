'use client';
import { useAppSelector } from "@/stores/hookStore";
import requestApi from "../../../helpers/api";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, Snackbar, Tooltip, Typography } from "@mui/material";
import { _ENV } from "@/contstants";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const PlaylistHistory = () => {
  const masterStore = useAppSelector((state: any) => state.master);
  const [historyData, setHistoryData] = useState<any>(null);

  const [videos, setVideos] = useState([]); 
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("HomePage");
  var flag = false;

  useEffect(() => {
    if (!flag) {
      fetchHistoriesByUser();
      flag = true;
    }
  }, []);

  const fetchHistoriesByUser = async () => {
    await requestApi("histories", 'GET').then((res: any) => {
      if (res.success) {
        setHistoryData(res.data);
        const extractedVideos = res.data.map((history: any) => history.video); 
        setVideos(extractedVideos);
      }
    }).catch((err: any) => {
      console.error(err);
    });
  };

  const handleOnClick = (videoId: string) => {
    if(masterStore.is_login){
      createHistory(videoId)
    }
    router.push(`/${locale}/detail/${videoId}`);
  };

  const createHistory = async (videoId: string) => {
  
    await requestApi(`histories/${videoId}`, "POST").then((res:any)=>{
       if(res.success){
        console.log("history save successfully");
       }else{
        console.error("Failed  save history");
       }
    }).catch((err:any)=>{
      console.error("Error history:", err);
    })
 
};

const deleteHistory = async (videoId: string) => {
  
  await requestApi(`histories/${videoId}`, "DELETE").then((res:any)=>{
     if(res.success){
       fetchHistoriesByUser()
     }else{
      console.error("delete failed");
     }
  }).catch((err:any)=>{
    console.error("Error history:", err);
  })
   console.error("Failed  delete history");
};


  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    !masterStore.is_login ? (
      <h1>Login</h1>
    ) : (
      <React.Fragment>
      <Grid container spacing={2} justifyContent="left">
        {videos.map((video: any) => (
          <Grid key={video.id} item sm={6} md={4} lg={3}>
            <Card sx={{ mx: 2, my: 1, width: 1 }}>
              {/* CardMedia để chứa thumbnail */}
              <CardMedia
                sx={{
                  height: 170,
                  objectFit: 'cover',
                  position: 'relative', // Đặt relative để định vị các thành phần
                }}
                image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
                title={video.name}
              >
                {/* Duration ở góc dưới bên phải của thumbnail */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền mờ
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  {formatDuration(video.timeout)} {/* Hiển thị thời gian */}
                </Box>
    
            
             
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    {t('seen')}
                  </Box>
                
              </CardMedia>
    
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 160,
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ height: 30, paddingBottom: 8 }}
                  >
                    {video.name.length > 50 ? (
                      <Tooltip title={video.name}>
                        <span
                          onClick={() => handleOnClick(video.id)}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          {`${video.name.substring(0, 50)}...`}
                        </span>
                      </Tooltip>
                    ) : (
                      <span
                        onClick={() => handleOnClick(video.id)}
                        className="cursor-pointer hover:text-blue-600"
                      >
                        {video.name}
                      </span>
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: '10px' }}
                  >
                    {video.description.length > 40 ? (
                      <Tooltip title={video.description}>
                        <span>{`${video.description.substring(0, 40)}...`}</span>
                      </Tooltip>
                    ) : (
                      video.description
                    )}
                  </Typography>
                </div>
                {/* Nút Xóa */}
             <Box sx={{ textAlign: 'right', marginTop: '5px' }}>
               <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() =>deleteHistory(video.id)} // Hàm xử lý khi bấm nút
                 >
                {t('delete')}
              </Button>
            </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


    </React.Fragment>
    
    
    
    )
  );
};

export default PlaylistHistory;

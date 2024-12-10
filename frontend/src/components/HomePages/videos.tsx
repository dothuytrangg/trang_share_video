'use client'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import requestApi from "../../../helpers/api";
import { useAppSelector } from "@/stores/hookStore";
import { useLocale, useTranslations } from "next-intl";
import { _ENV } from "@/contstants";
import { useRouter } from "next/navigation";

export default function Videos({ categoryId }: { categoryId: string }) {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]); // Dùng để lưu mảng `video`
  const [videoDetails, setVideoDetails] = useState([]); // Lưu API gốc
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const [hasReachedHalf, setHasReachedHalf] = useState(false);
  const masterStore = useAppSelector((state: any) => state.master);
  var flag = false;

  
 
  
  const handleOnClick = (videoId: string) => {
    if(masterStore.is_login){
      createHistory(videoId)
    }
    router.push(`/${locale}/detail/${videoId}?categoryId=${categoryId}`);
    
  };

  useEffect(() => {
   if(!flag){
    loadVideoDetails(page);
    flag = true;
   }

   
  }, [categoryId]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const loadVideoDetails = async (pageSelected: number) => {
      
      try {
        const res: any = await requestApi(`video-details/${categoryId}?page=${pageSelected}&items_per_page=9&search`, "GET");
        console.log('res',res)
        if (res.success) {
          setVideoDetails(res.data);
          const extractedVideos = res.data.map((detail: any) => detail.video); 
          setVideos(extractedVideos);
          setLastPage(res.lastPage);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      loadVideoDetails(value);
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

    // Hàm chuyển đổi giây thành định dạng HH:mm:ss
   const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
  {videos.map((video: any) => (
    video.status === 'confirmed' && (
      <Grid key={video.id} item sm={2} lg={3} sx={{ width: 1 }}>
        <Card sx={{ mx: 2, my: 1, width: 1 }}>
          <CardMedia
            sx={{ height: 170, position: 'relative' }} // Thêm position relative để định vị
            image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
            title={video.name}
           >
                       
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
                  {formatDuration(video.timeout)} 
              </Box>
          </CardMedia>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 140 }}>
            <div>
              <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
                {video.name.length > 50 ? (
                  <Tooltip title={video.name}>
                    <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">
                      {`${video.name.substring(0, 50)}...`}
                    </span>
                  </Tooltip>
                ) : (
                  <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">
                    {video.name}
                  </span>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                {video.description.length > 70 ? (
                  <Tooltip title={video.description}>
                    <span>{`${video.description.substring(0, 70)}...`}</span>
                  </Tooltip>
                ) : (
                  video.description
                )}
              </Typography>
            </div>
 
          </CardContent>
        </Card>

      </Grid>
    )
  ))}
  <Stack
          spacing={2}
          sx={{
            position: "relative",
            bottom: 0,
            width: "100%",
          }}
        >
          <Pagination
            style={{ margin: 10 }}
            count={lastPage}
            page={page}
            onChange={handleChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      
</React.Fragment>

  );
}

'use client'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
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
  var flag = false;

  
 
  
  const handleOnClick = (videoId: string) => {
    router.push(`/${locale}/detail/${videoId}?categoryId=${categoryId}`);
  };

  useEffect(() => {
   if(!flag){
    loadVideoDetails();
    flag = true;
   }

   
  }, [categoryId]);
    const loadVideoDetails = async () => {
      
      try {
        const res: any = await requestApi(`video-details/${categoryId}`, "GET");
        console.log('res',res)
        if (res.success) {
          setVideoDetails(res.data);
          const extractedVideos = res.data.map((detail: any) => detail.video); 
          setVideos(extractedVideos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
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
            <Grid key={video.id} item sm={2} lg={3} sx={{ width: 1 }} >
            <Card sx={{ mx: 2, my: 1, width: 1 }} >
              <CardMedia
                sx={{ height: 170 }}
                image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
                title={video.name}
              />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 140 }}>
            <div>
              <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
                {video.name.length > 50 ? (
                  <Tooltip title={video.name}>
                    <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{`${video.name.substring(0, 50)}...`}</span>
                  </Tooltip>
                ) : (
                  <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{video.name}</span>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{marginBottom:'10px'}}>
                {video.description.length > 40 ? (
                  <Tooltip title={video.description}>
                    <span>{`${video.description.substring(0, 40)}...`}</span>
                  </Tooltip>
                ) : (
                  video.description
                )}
              </Typography>
            </div>
            <Typography  variant="body2"  sx={{ marginTop: 'auto', textAlign: 'right'}}>
             {t('duration')}: {formatDuration(video.timeout)}
            </Typography>
          </CardContent>

            </Card>
          </Grid>
          )
      ))}
    </React.Fragment>
  );
}

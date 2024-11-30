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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {videos.map((video: any) => (

        <Grid key={video.id} item sm={2} lg={3} sx={{ width: 1 }} >
          <Card sx={{ mx: 2, my: 1, width: 1 }} >
            <CardMedia
              sx={{ height: 140 }}
              image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
              title={video.name}
            />
            <CardContent sx={{ height: 140 }}>
              <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
                {video.name.length > 50 ? (
                  <Tooltip title={video.name}>
                    <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{`${video.name.substring(0, 50)}...`}</span>
                  </Tooltip>
                ) :
                  <span onClick={() => handleOnClick(video.id)} className="cursor-pointer hover:text-blue-600">{video.name}</span>
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.description.length > 100 ? (
                  <Tooltip title={video.description}>
                    <span>{`${video.description.substring(0, 100)}...`}</span>
                  </Tooltip>
                ) : (
                  video.description
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </React.Fragment>
  );
}

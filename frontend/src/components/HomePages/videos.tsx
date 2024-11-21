'use client'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
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

  
  const handleOnClick = (videoId: string) => {
    router.push(`/en/detail/${videoId}`); 
  };
  useEffect(() => {
   
    const loadVideos = async () => {
      try {
        const res: any = await requestApi(`video-details/${categoryId}`, "GET");
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

    loadVideos();
  }, [categoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {videos.map((video: any) => (
        <Card key={video.id} sx={{ maxWidth: 345, my: 1 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={`${_ENV.NEXT_URL_LOCAL}/videos/${video.thumbnail}`} 
            title={video.name}
          />
          <CardContent sx={{ height: 140 }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
              {video.name.length > 50 ? (
                <Tooltip title={video.name}>
                  <span>{`${video.name.substring(0, 50)}...`}</span>
                </Tooltip>
              ) : (
                video.name
              )}
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
          <CardActions>
            <Button
              sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
              color="inherit"
              variant="contained"
              size="small"
            >
              Share
            </Button>
            <Button
              sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
              color="inherit"
              variant="contained"
              size="small"
              onClick={()=>handleOnClick(video.id)}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      ))}
    </React.Fragment>
  );
}

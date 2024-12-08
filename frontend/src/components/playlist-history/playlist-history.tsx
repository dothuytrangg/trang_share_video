'use client';
import { useAppSelector } from "@/stores/hookStore";
import requestApi from "../../../helpers/api";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Grid, Tooltip, Typography } from "@mui/material";
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
    router.push(`/${locale}/detail/${videoId}`);
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
                <CardMedia
                  sx={{ height: 170, objectFit: 'cover' }}
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
          ))}
        </Grid>
      </React.Fragment>
    )
  );
};

export default PlaylistHistory;

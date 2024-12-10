'use client';
import {
    Box,
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
import { useLocale, useTranslations } from "next-intl";
import { _ENV } from "@/contstants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/stores/hookStore";

export default function SearchPage({ categoryId }: { categoryId: string }) {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<any[]>([]); // Lưu mảng video
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(''); // Từ khóa tìm kiếm
    const locale = useLocale();
    const t = useTranslations("HomePage");
    const searchParams = useSearchParams(); // Lấy tham số tìm kiếm từ URL
    const router = useRouter();
    var flag = false;
    const [videoDetails, setVideoDetails] = useState([]); // Lưu API gốc
    const masterStore = useAppSelector((state: any) => state.master);


    useEffect(() => {
        const searchQuery = searchParams.get('query'); // Lấy từ khóa tìm kiếm từ URL
        if (searchQuery) {
            setQuery(searchQuery);
            fetchVideos(searchQuery); 
        }
    }, [searchParams]);

    const fetchVideos = async (searchTerm: string) => {
        setLoading(true);
        setError(null);
        try {
            const res: any = await requestApi(`videos/key?search=${searchTerm}`, 'GET');
            console.log('search',res)
            if (res.success) {
                setVideos(res.data);
            } else {
                setError('Không tìm thấy video nào.');
            }
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = (videoId: string) => {
        if(masterStore.is_login){
            createHistory(videoId)
          }
        router.push(`/${locale}/detail/${videoId}?categoryId=${categoryId}`);
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
    useEffect(() => {
        if (!flag) {
            loadVideoDetails();
            flag = true;
        }


    }, [categoryId]);
    const loadVideoDetails = async () => {

        try {
            const res: any = await requestApi(`video-details/${categoryId}`, "GET");
            console.log('res', res)
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
            {error ? (
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Grid container spacing={2} justifyContent="flex-start">
                        {videos
                            .filter((video: any) => video.status === 'confirmed') 
                            .map((video: any) => (
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
                    ))}
                </Grid>
            )}
        </React.Fragment>
    );
}

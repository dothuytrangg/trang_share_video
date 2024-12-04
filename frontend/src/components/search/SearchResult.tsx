'use client';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Tooltip,
    Typography,
    Pagination,
    Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import requestApi from "../../../helpers/api";
import { useLocale, useTranslations } from "next-intl";
import { _ENV } from "@/contstants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function SearchPage({ categoryId }: { categoryId: string }) {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<any[]>([]); // Dùng để lưu mảng video
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
    const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
    const [query, setQuery] = useState<string>(''); // Từ khóa tìm kiếm
    const locale = useLocale();
    const t = useTranslations("HomePage");
    const searchParams = useSearchParams(); // Lấy tham số tìm kiếm từ URL
    const router = useRouter();
    const [videoDetails, setVideoDetails] = useState([]); // Lưu API gốc
    var flag = false;


    useEffect(() => {
        const searchQuery = searchParams.get('query'); // Lấy từ khóa tìm kiếm từ URL
        if (searchQuery) {
            setQuery(searchQuery);
            fetchVideos(searchQuery, 1); // Tìm kiếm với trang đầu tiên
        }
    }, [searchParams]);

    const fetchVideos = async (searchTerm: string, page: number) => {
        setLoading(true);
        setError(null);
        try {
            const res: any = await requestApi(`videos/key?search=${searchTerm}`, 'GET');
            if (res.success) {
                setVideos(res.data);
                setTotalPages(Math.ceil(res.total / res.items_per_page)); // Tính tổng số trang
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
        router.push(`/${locale}/detail/${videoId}?categoryId=${categoryId}`);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            {/* Hiển thị nếu có lỗi */}
            {error ? (
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Grid container spacing={2} justifyContent="flex-start">
                    {/* Hiển thị video */}
                    {videos.map((video: any) => (
                        <Grid item xs={12} sm={6} md={3} key={video.id}>
                            <Card sx={{ maxWidth: '100%' }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
                                    title={video.name}
                                />
                                <CardContent sx={{ height: 140 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ height: 30, paddingBottom: 8 }}>
                                        {video.name.length > 50 ? (
                                            <Tooltip title={video.name}>
                                                <span>{`${video.name.substring(0, 50)}...`}</span>
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
                </Grid>
            )}
          
        </React.Fragment>
    );
}

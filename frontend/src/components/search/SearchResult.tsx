'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import requestApi from '../../../helpers/api';
import React from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Pagination,
    Stack,
    Tooltip,
    Typography,
    Grid, // Sử dụng Grid thay vì Stack
} from "@mui/material";
import { _ENV } from "@/contstants";

const SearchPage = () => {
    const searchParams = useSearchParams(); // Lấy query từ URL
    const [query, setQuery] = useState<string>(''); // Lưu từ khóa tìm kiếm
    const [videos, setVideos] = useState<any[]>([]); // Danh sách video
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1); // Tổng số trang
    const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại

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
            const res: any = await requestApi(`videos/key?search=${searchTerm}&page=${page}`, 'GET');
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

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        fetchVideos(query, page); // Gọi API cho trang mới
    };

    return (
        <React.Fragment>
            {/* Hiển thị khi đang tải */}
            {loading ? (
                <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                        Đang tải dữ liệu...
                    </Typography>
                </Stack>
            ) : error ? (
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <>
                    {/* Hiển thị danh sách video */}
                    <Grid container spacing={2} justifyContent="flex-start">
                        {videos.map((video: any) => (
                            <Grid item xs={12} sm={6} md={3} key={video.id}>
                                <Card sx={{ maxWidth: '100%' }}>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`}
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
                                        <Button sx={{ ml: 1, pr: 1, textTransform: 'none', mt: 2 }} color="inherit" variant="contained" size="small">
                                            Share
                                        </Button>
                                        <Button sx={{ ml: 1, pr: 1, textTransform: 'none', mt: 2 }} color="inherit" variant="contained" size="small">
                                            Learn More
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Phân trang */}
                    <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePaginationChange}
                            color="primary"
                            size="large"
                        />
                    </Stack>
                </>
            )}
        </React.Fragment>
    );
};

export default SearchPage;

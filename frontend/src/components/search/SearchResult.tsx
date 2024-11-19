'use client'
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
    Pagination,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { _ENV, _GLOBAL } from "@/contstants";



const SearchPage = () => {
    const searchParams = useSearchParams(); // Lấy query từ URL bằng useSearchParams
    const [query, setQuery] = useState<string>(''); // Lưu từ khóa tìm kiếm
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]); // Kết quả tìm kiếm
    const [error, setError] = useState<string | null>(null);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        const searchQuery = searchParams.get('query'); // Lấy giá trị của query từ URL
        if (searchQuery) {
            setQuery(searchQuery); // Cập nhật query
            fetchSearchResults(searchQuery); // Thực hiện tìm kiếm
            loadVideos(searchQuery);
        }
    }, [searchParams]); // Khi URL query thay đổi

    const fetchSearchResults = async (searchTerm: string) => {
        setLoading(true);
        setError(null);
    }
    const loadVideos = async (key : string) => {
        await requestApi(`videos/key?search=${key}`, "GET").then((res: any) => {
            console.log('res videos', res);
            if (res.success) {
                setVideos(res.data);
             
            }

        }).catch((err: any) => {
            console.error(err);
        })
        // console.log(check)
        // setCategories(check.data);
        // console.log('category hhh',categories);
    };
    const handleChange = (event: React.ChangeEvent<unknown>, value: string) => {

        loadVideos(value);
    };

    
           
    return (
        <React.Fragment>
            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="flex-start">
                {videos.map((video: any) => (
                    <Card key={video.id} sx={{ maxWidth: 250, my: 1 }}>  {/* Giảm maxWidth để card nhỏ hơn */}
                        <CardMedia
                            sx={{ height: 140 }}
                            image={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`}
                            title="green iguana"
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
                            <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }} color="inherit" variant="contained" size="small">
                                Share
                            </Button>
                            <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }} color="inherit" variant="contained" size="small">
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Stack>

            <br />
            <Stack spacing={2}>
                <Pagination style={{ margin: 10 }} count={5} />
            </Stack>
        </React.Fragment>
    );
};
export default SearchPage;

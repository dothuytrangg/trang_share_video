'use client';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import requestApi from "../../../helpers/api";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { _ENV } from "@/contstants";

export default function LikePlayList() {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]); // Lưu danh sách video yêu thích
    const router = useRouter();
    const locale = useLocale();
    const [likes, setLikes] = useState<number>(0);
    const { videoId } = useParams();




    const handleOnClick = (videoId: string) => {
        router.push(`/${locale}/detail/${videoId}`);
    };
    const handleRemoveLike = async (videoId: number) => {
        // Kiểm tra xem videoId có trong danh sách yêu thích không
        requestApi(`playlist-like/remove/${videoId}`, "DELETE")
            .then((res: any) => {
                console.log("Xóa video yêu thích:", res);
                if (res.success) {
                    // Nếu xóa thành công thì tải lại danh sách video yêu thích
                    // loadLikedVideos();
                }
            })
    }

    useEffect(() => {
        loadLikedVideos();
    }, []);

    const handleLike = () => {
        // Bật trạng thái loading khi bắt đầu thao tác
        setLoading(true);

        // Gọi API profile để lấy thông tin người dùng (userId)
        requestApi('users/profile', 'GET')
            .then((userResponse: any) => {
                if (userResponse.success) {
                    const userId = userResponse.data.id;  // Lấy userId từ thông tin trả về

                    console.log("videoId", videoId);
                    console.log("userId", userId);

                    // Gọi API để like video
                    return requestApi(`playlist-like/${userId}/${videoId}`, 'POST');
                } else {
                    console.error("Không thể lấy thông tin người dùng");
                    return Promise.reject("Không thể lấy thông tin người dùng");
                }
            })
            .then((likeResponse: any) => {
                // Kiểm tra kết quả từ API like
                if (likeResponse.success) {
                    setLikes(likeResponse.data);  // Cập nhật lại số lượt thích
                } else {
                    console.error("Không thể like video");
                }
            })
            .catch((err: any) => {
                console.error("Lỗi khi thực hiện like:", err);
            })
            .finally(() => {
                // Tắt trạng thái loading khi thao tác hoàn thành
                setLoading(false);
            });
    };


    const loadLikedVideos = async () => {
        try {
            const res: any = await requestApi("playlist-like/videos", "GET");
            console.log("Dữ liệu từ API:", res); // Xem chi tiết dữ liệu trả về
            if (res.success) {
                const extractedVideos = res.data.map((item: any) => item.video);
                setVideos(extractedVideos);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách video yêu thích:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            {videos.map((video: any) => (
                <Grid key={video.id} item xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ width: "100%", position: "relative" }}>
                        {/* Nút xóa video */}
                        <IconButton
                            sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
                            onClick={() => handleRemoveLike(video.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <CardMedia
                            sx={{ height: 140, cursor: "pointer" }}
                            image={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`}
                            title={video.name}
                            onClick={() => handleOnClick(video.id)}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div" noWrap>
                                {video.name.length > 50 ? (
                                    <Tooltip title={video.name}>
                                        <span>{`${video.name.substring(0, 50)}...`}</span>
                                    </Tooltip>
                                ) : (
                                    video.name
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
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
    );
}
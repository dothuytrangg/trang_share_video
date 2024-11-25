'use client'
import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';

// Định nghĩa kiểu dữ liệu cho Video
interface Video {
    id: number;
    name: string;
    thumbnail: string;
    viewed: number;
    created_at: string;
}

// Định nghĩa kiểu dữ liệu cho Playlist
interface Playlist {
    id: number;
    name: string;
    thumbnail: string;
    videoCount: number;
    videos: Video[];
}

// Dữ liệu giả
const playlists: Playlist[] = [
    {
        id: 1,
        name: "Playlist 1",
        thumbnail: "https://via.placeholder.com/300x200",
        videoCount: 5,
        videos: [
            { id: 1, name: "Video 1", thumbnail: "https://via.placeholder.com/100", viewed: 1000, created_at: "2024-11-01" },
            { id: 2, name: "Video 2", thumbnail: "https://via.placeholder.com/100", viewed: 1500, created_at: "2024-11-05" },
            { id: 3, name: "Video 3", thumbnail: "https://via.placeholder.com/100", viewed: 2000, created_at: "2024-11-07" },
        ]
    },
    {
        id: 2,
        name: "Playlist 2",
        thumbnail: "https://via.placeholder.com/300x200",
        videoCount: 3,
        videos: [
            { id: 4, name: "Video 4", thumbnail: "https://via.placeholder.com/100", viewed: 500, created_at: "2024-11-03" },
            { id: 5, name: "Video 5", thumbnail: "https://via.placeholder.com/100", viewed: 2000, created_at: "2024-11-07" },
        ]
    }
];

// Component hiển thị danh sách Playlist
function PlaylistList() {
    return (
        <Grid container spacing={2}>
            {playlists.map((playlist: Playlist) => (
                <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={playlist.thumbnail}
                            alt={playlist.name}
                        />
                        <CardContent >
                            <Typography variant="h6">{playlist.name}</Typography>
                            <Typography variant="body2">{playlist.videoCount} videos</Typography>
                            {/* Thêm các nút Xóa và Sửa */}
                            <Button variant="contained" color="primary" >Sửa</Button>
                            <Button variant="contained" color="secondary">Xóa</Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// Component hiển thị chi tiết Playlist (Khi chọn một playlist)
function PlaylistDetail({ playlist }: { playlist: Playlist }) {
    return (
        <div>
            <Typography variant="h4" gutterBottom>{playlist.name}</Typography>
            <List>
                {playlist.videos.map((video: Video) => (
                    <ListItem key={video.id}>
                        <ListItemAvatar>
                            <Avatar variant="square" src={video.thumbnail} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={video.name}
                            secondary={`${video.viewed} views • ${video.created_at}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

// App component
function App() {
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<Playlist | null>(null);

    return (
        <div>
            {/* Danh sách Playlist */}
            <Typography variant="h4" gutterBottom>Playlists</Typography>
            <PlaylistList />

            {/* Hiển thị chi tiết Playlist khi chọn */}
            {selectedPlaylist && <PlaylistDetail playlist={selectedPlaylist} />}
        </div>
    );
}

export default App;

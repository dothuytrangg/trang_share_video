import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PlaylistLikeService } from './playlist-like.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('playlist-like')
export class PlaylistLikeController {
    constructor(private likePlaylistService: PlaylistLikeService){}

    @UseGuards(AuthGuard)
    @Post(':userId/:videoId')
    async addVideoToLikePlaylist(
        @Param('userId') userId: number, // Lấy userId từ tham số URL
        @Param('videoId') videoId: number // Lấy videoId từ tham số URL
    ) {
        console.log('userId:', userId);
        console.log('videoId:', videoId);
        return await this.likePlaylistService.likeVideo(userId, videoId);
    }

    @UseGuards(AuthGuard)
    @Get('videos')
    async getAllLikePlaylist() {
        return this.likePlaylistService.getAllLikePlaylist();
    }

    @UseGuards(AuthGuard)
    @Delete('remove/:id')
    delete(@Param('id') id:number){
        return this.likePlaylistService.removeVideoToLikePlaylist(id);
    }
}

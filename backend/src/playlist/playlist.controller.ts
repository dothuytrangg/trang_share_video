import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';

@Controller('playlist')
export class PlaylistController {
    constructor(private playlistService:PlaylistService){}

    @Post()
    createPlaylist(@Body() createPlaylistDto:CreatePlaylistDto){
        return this.playlistService.create(createPlaylistDto);
    }

    @Delete(':id')
    deletePlaylist(@Param('id') id: number){
        return this.playlistService.deletePlaylist(id);
    }

    @Get()
    findAllPlaylists():Promise<Playlist[]>{
        return this.playlistService.findAllPlaylists();
    }

    @Get(':id')
    findOne(@Param('id') id:number):Promise<Playlist>{
        return this.playlistService.findOnePlaylist(Number(id));
    }

    // @Post(':playlistId/videos/:videoId')
    // async addVideoToPlaylist(
    //     @Param('playlistId') playlistId: number,
    //     @Param('videoId') videoId: number,
    // ) {
    //     return await this.playlistService.addVideoToPlaylist(playlistId, videoId);
    // }



}

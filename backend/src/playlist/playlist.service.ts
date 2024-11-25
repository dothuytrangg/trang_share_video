import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { common } from '@mui/material/colors';
import { common_response } from 'src/ultils/common';
import { Video } from 'src/videos/entities/videos.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist) private playlistRepository: Repository<Playlist>,
        @InjectRepository(Video) private videoRepository: Repository<Video>,
    ) {}

    async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        let response  = common_response
        try {
            const playlist = await this.playlistRepository.save(createPlaylistDto);
            if(playlist){
                response.success = true;
                response.data = playlist;
            }else{
             response.success = false;
            }
        } catch (error) {
            response.success = false;
            response.message = error.message;
            
        }
        return response;

    }

    async deletePlaylist(id: number): Promise<DeleteResult> {
        let response = common_response;
        try {
            const playlist = await this.playlistRepository.delete(id);
            if(playlist){
                response.success = true;
                response.data = playlist;
            }else{
                response.success = false;
            }
        } catch (error) {
            response.success = false;
            response.message = error.message;
        }
        return response;
    }

    async findAllPlaylists(): Promise<Playlist[]> {
        let response = common_response;
            const playlists = await this.playlistRepository.find({
                select: ['id', 'name', 'video_id', 'created_at'],
            });
            if(playlists.length > 0){
                response.success = true;
                response.data = playlists;
            }else{
                response.success = false;
            }
       
        return response;
    }

    async findOnePlaylist(id: number): Promise<Playlist> {
        let response = common_response;
        let playlist = await this.playlistRepository.findOneBy({id});
        if(playlist){
            response.success = true;
            response.data = playlist;
        }else{
            response.success = false;
        }
        return response;
}

    // // Thêm video vào playlist
    // async addVideoToPlaylist(playlistId: number, videoId: number): Promise<any> {
    //     const playlist = await this.playlistRepository.findOne({
    //         where: { id: playlistId },
    //         relations: ['video'],
    //     });

    //     if (!playlist) {
    //         throw new Error('Playlist not found');
    //     }

    //     const video = await this.videoRepository.findOne({ where: { id: videoId } });

    //     if (!video) {
    //         throw new Error('Video not found');
    //     }

    //     // Kiểm tra nếu video đã tồn tại trong playlist
    //     const isVideoInPlaylist = playlist.video.some((v) => v.id === videoId);
    //     if (isVideoInPlaylist) {
    //         throw new Error('Video is already in the playlist');
    //     }

    //     // Thêm video vào danh sách
    //     playlist.video.push(video);

    //     // Lưu thay đổi
    //     await this.playlistRepository.save(playlist);

    //     return {
    //         success: true,
    //         message: 'Video added to playlist successfully',
    //         data: playlist,
    //     };
    // }

}

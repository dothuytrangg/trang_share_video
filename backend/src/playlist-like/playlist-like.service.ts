import { response } from 'express';
import { common } from '@mui/material/colors';
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/users.entity";
import { Video } from "src/videos/entities/videos.entity";
import { DeleteResult, Repository } from "typeorm";
import { LikePlaylist } from "./entities/likeplaylist.entity";
import { common_response } from "src/ultils/common";

@Injectable()
export class PlaylistLikeService {
    constructor(
        @InjectRepository(LikePlaylist) private likePlaylistRepository: Repository<LikePlaylist>,
        @InjectRepository(Video) private videoRepository: Repository<Video>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async likeVideo(userId: number, videoId: number) {
        // Kiểm tra video có tồn tại không
        const response = common_response;
        const video = await this.videoRepository.findOne({ where: { id: videoId } });
        if (!video) {
           response.success = false;
           response.message = "Video không tồn tại"
           return response

        }

        // Kiểm tra user có tồn tại không
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            response.success = false
            response.message = "User không tồn tại"
            return response

        }

        // Kiểm tra trạng thái like của người dùng
        let likePlaylist = await this.likePlaylistRepository.findOne({
            where: { user: { id: userId }, video: { id: videoId } },
        });

        if (likePlaylist) {
            if (likePlaylist.status === "like") {
                // Nếu trạng thái hiện tại là "like", gỡ bỏ trạng thái like
                likePlaylist.status = null;
                video.likes--; // Giảm số lượt like
            } else {
                // Nếu đã tồn tại nhưng trạng thái khác (hoặc không có trạng thái), đặt lại là "like"
                likePlaylist.status = "like";
                video.likes++; // Tăng số lượt like
            }
            likePlaylist.updated_at = new Date();
        } else {
            // Nếu chưa tồn tại bản ghi, tạo mới trạng thái "like"
            likePlaylist = this.likePlaylistRepository.create({
                user,
                video,
                status: "like",
            });
            video.likes++; // Tăng số lượt like
        }

        // Lưu các thay đổi vào database
        await this.likePlaylistRepository.save(likePlaylist);
        await this.videoRepository.save(video);

        return {
            message: likePlaylist.status === "like"
                ? "Video đã được like thành công."
                : "Bạn đã bỏ like video.",
            likePlaylist,
        };
    }

   

    async getAllLikePlaylist(): Promise<LikePlaylist[]> {
        const response = common_response
        const likedPlaylists = await this.likePlaylistRepository.find({
            where: { status: 'like' },
            relations: ['user', 'video'],
        });
        if(likedPlaylists){
            response.success = true
            response.message = "ok"
            response.data = likedPlaylists;
           
        }else{
            response.success = false
            response.message = "no ok"
            response.data = [];
        }

        console.log("Liked Playlists:", likedPlaylists); // Kiểm tra kết quả
        return response;
    }

    async removeVideoToLikePlaylist(id: number): Promise<DeleteResult> {
        let response = common_response;
        console.log('Removing video with ID:', id);
        try {
            // Tìm video trong danh sách yêu thích (playlist like) bằng ID của video trong bảng likePlaylist
            const likedVideo = await this.likePlaylistRepository.findOne({
                where: { id }, // ID từ bảng likePlaylist
                relations: ['video'], // Kết nối với bảng video để truy xuất thông tin video
            });

            if (!likedVideo) {
                response.success = false;
                response.message = 'Video không tồn tại trong danh sách yêu thích.';
                return response;
            }

            // Xóa video khỏi danh sách yêu thích (playlist like)
            await this.likePlaylistRepository.delete({ id });

            // Tìm lại video trong bảng video bằng ID video của bảng likePlaylist
            const video = await this.videoRepository.findOne({
                where: { id: likedVideo.video.id }, // Lấy ID của video từ bảng likePlaylist
            });

            if (video && video.likes) {
                video.likes--; // Giảm 1 lượt thích
                await this.videoRepository.save(video); // Cập nhật lại video với lượt like đã giảm
            }

            response.success = true;
            response.message = 'Video đã được xóa khỏi danh sách yêu thích và giảm lượt thích.';
            return response;

        } catch (error) {
            response.success = false;
            response.message = `Lỗi: ${error.message}`;
            return response;
        }
    }



}

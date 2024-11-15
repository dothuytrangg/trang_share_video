import { CreateTagToVideoDto } from './dto/create-tag-to-video.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/videos.entity';
import { Repository } from 'typeorm';
import { TagDetail } from './entities/tagsdetail.entity';

@Injectable()
export class TagDetailService {
    constructor(
        @InjectRepository(TagDetail)
        private readonly tagDetailRepository: Repository<TagDetail>,
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
    ) { }

    async addTagToVideo(createTagToVideo: CreateTagToVideoDto): Promise<TagDetail> {
        // Sử dụng cú pháp đúng khi tìm video
        const video = await this.videoRepository.findOne({ where: { id: createTagToVideo.videoId } });
        if (!video) {
            throw new Error('Video not found');
        }

        // Khởi tạo tagDetail với thông tin từ DTO
        const tagDetail = new TagDetail();
        tagDetail.video_id = createTagToVideo.videoId;
        tagDetail.tag_id = createTagToVideo.tagId;
        tagDetail.user_id = createTagToVideo.userId;
        tagDetail.status = 'active';  // Trạng thái có thể thay đổi tùy nhu cầu

        // Lưu tagDetail vào cơ sở dữ liệu
        return this.tagDetailRepository.save(tagDetail);
    }

    async removeTagFromVideo(createTagToVideo: CreateTagToVideoDto): Promise<void> {
        // Tìm bản ghi TagDetail với video_id và tag_id tương ứng
        const tagDetail = await this.tagDetailRepository.findOne({
            where: {
                video_id: createTagToVideo.videoId,
                tag_id: createTagToVideo.tagId,
            },
        });

        // Nếu không tìm thấy liên kết, ném lỗi
        if (!tagDetail) {
            throw new Error('Tag not found for this video');
        }

        // Xóa liên kết giữa video và tag
        await this.tagDetailRepository.remove(tagDetail);
    }


}

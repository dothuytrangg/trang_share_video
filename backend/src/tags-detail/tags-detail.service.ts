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

    async assignTagsToVideo(videoId: number, tagIds: number[], userId: number): Promise<any> {
        const video = await this.videoRepository.findOne({ where: { id: videoId } });

        if (!video) {
            throw new Error('Video not found');
        }

        const tagDetails = tagIds.map(tagId => ({
            video_id: videoId,
            tag_id: tagId,
            user_id: userId,
            status: 'active',  // Hoặc trạng thái khác mà bạn muốn
        }));

        // Thêm thông tin tag vào bảng tag_details
        await this.tagDetailRepository.save(tagDetails);

        return { message: 'Tags assigned successfully' };
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

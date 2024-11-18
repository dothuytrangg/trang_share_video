import { Body, Controller, Param, Post } from '@nestjs/common';
import { TagDetailService } from './tags-detail.service';
import { create } from 'domain';
import { CreateTagToVideoDto } from './dto/create-tag-to-video.dto';
import { TagDetail } from './entities/tagsdetail.entity';

@Controller('tags-detail')
export class TagDetailController {
    constructor(private readonly tagsDetailService: TagDetailService) {}

    @Post(':id/assign-tags')
    async assignTags(
        @Param('id') videoId: number,  // ID video cần gán tag
        @Body('tagIds') tagIds: number[],  // Mảng ID tag cần gán
        @Body('userId') userId: number,  // ID người dùng
    ) {
        return await this.tagsDetailService.assignTagsToVideo(videoId, tagIds, userId);
    }
}

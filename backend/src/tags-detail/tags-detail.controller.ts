import { Body, Controller, Post } from '@nestjs/common';
import { TagDetailService } from './tags-detail.service';
import { create } from 'domain';
import { CreateTagToVideoDto } from './dto/create-tag-to-video.dto';
import { TagDetail } from './entities/tagsdetail.entity';

@Controller('tags-detail')
export class TagDetailController {
    constructor(private readonly tagsDetailService: TagDetailService) {}

    @Post('add-to-video')
    async addTagToVideo(@Body() createTagToVideo: CreateTagToVideoDto):Promise<TagDetail>  {
        return this.tagsDetailService.addTagToVideo(createTagToVideo);
    }

}

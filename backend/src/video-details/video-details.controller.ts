import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterVideoDetailDto } from 'src/video-details/dto/filter-video-detail.to';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { VideoDetailsService } from 'src/video-details/video-details.service';

@Controller('video-details')
export class VideoDetailsController {
    constructor(private videoDetailService:VideoDetailsService){}

    @UseGuards(AuthGuard)
    @Post(':id')
    create(@Param('id') id:string){
        // const userId = req.user_data.id;
        
     
        return this.videoDetailService.create(Number(id),86);
    }

   
    @Get(':id')
    findAll(@Param('id') id:string,@Query() query:FilterVideoDetailDto):Promise<VideoDetail>{
        return this.videoDetailService. findAllByCategoryId(Number(id),query);
    }

    // @Get(':id')
    // findAllByCategory(@Param('id') id:string):Promise<VideoDetail>{
    //     return this.videoDetailService. findAllByCategoryId(Number(id));
    // }

    
}

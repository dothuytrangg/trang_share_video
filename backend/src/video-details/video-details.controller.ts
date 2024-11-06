import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { VideoDetailsService } from 'src/video-details/video-details.service';

@Controller('video-details')
export class VideoDetailsController {
    constructor(private videoDetailService:VideoDetailsService){}

    @UseGuards(AuthGuard)
    @Post(':id')
    create(@Param('id') id:string){
        // const userId = req.user_data.id;
        
     
        return this.videoDetailService.create(Number(id));
    }

    
}

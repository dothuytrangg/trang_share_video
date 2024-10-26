import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { VideosService } from 'src/videos/videos.service';

@Controller('videos')
export class VideosController {
    constructor(private videoService:VideosService){}

    @UseGuards(AuthGuard)
    @Get()
    findAll():Promise<Video[]>{
        return this.videoService.findAll();
    }
        
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Req() req:any,@Body() createVideoDto:CreateVideoDto):Promise<Video>{
        const userId = req.user_data.id;
        console.log('user data',req.user_data)
        return this.videoService.create(createVideoDto,userId);
    }
    
}

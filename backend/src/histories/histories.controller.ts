import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { History } from 'src/histories/entities/histories.entity';
import { HistoriesService } from 'src/histories/histories.service';

@Controller('histories')
export class HistoriesController {
    constructor(private historiesService:HistoriesService
    ){}

    
    @UseGuards(AuthGuard)
    @Get()
    async findByUserId(@Req() req:any):Promise<History> {
        const userId = req.user_data.id;

    return  this.historiesService.findByUserId(userId)
    //   return this.videoService.incrementViews(Number(id));
    }
    @UseGuards(AuthGuard)
    @Post(':id')
    async create(@Param('id') videoId: string,@Req() req:any) {
        const userId = req.user_data.id;

    return this.historiesService.create(Number(videoId),userId)
    //   return this.videoService.incrementViews(Number(id));
    }


    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteHistory(@Param('id') videoId: string) {
      

    return this.historiesService.deleteHistory(Number(videoId))
    //   return this.videoService.incrementViews(Number(id));
    }


}

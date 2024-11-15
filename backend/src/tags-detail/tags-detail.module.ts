import { Module } from '@nestjs/common';
import { TagDetailController } from './tags-detail.controller';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tags.entity';
import { TagDetail } from './entities/tagsdetail.entity';
import { TagDetailService } from './tags-detail.service';
import { Video } from 'src/videos/entities/videos.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TagDetail, Video]), ConfigModule],
    providers: [TagDetailService],
    controllers: [TagDetailController],
    exports: [TagDetailService]
   
})
export class TagDetailModule { }

import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { ConfigModule } from '@nestjs/config';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Category } from 'src/categories/entities/categories.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Video,VideoDetail,Category]),ConfigModule],
  providers: [VideosService],
  exports: [VideosService],
  controllers: [VideosController],

})
export class VideosModule {}

import { Module } from '@nestjs/common';
import { VideoDetailsService } from './video-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { VideoDetailsController } from 'src/video-details/video-details.controller';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([User,Video,Category,VideoDetail]),ConfigModule],
  providers: [VideoDetailsService],
  exports: [VideoDetailsService],
  controllers: [VideoDetailsController],
})
export class VideoDetailsModule {}

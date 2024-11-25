import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { ConfigModule } from '@nestjs/config';
import { Video } from 'src/videos/entities/videos.entity';
import { VideosService } from 'src/videos/videos.service';


@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Video]), ConfigModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}

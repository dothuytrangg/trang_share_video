import { Module } from '@nestjs/common';
import { PlaylistLikeController } from './playlist-like.controller';
import { PlaylistLikeService } from './playlist-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { LikePlaylist } from './entities/likeplaylist.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video, LikePlaylist]), ConfigModule],
  controllers: [PlaylistLikeController],
  providers: [PlaylistLikeService]
})
export class PlaylistLikeModule {}

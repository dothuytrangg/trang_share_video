import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Video } from 'src/videos/entities/videos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,VideoDetail,Video]),ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],

})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { History } from 'src/histories/entities/histories.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([User,Video,History]),ConfigModule],
  controllers: [HistoriesController],
  providers: [HistoriesService]
})
export class HistoriesModule {}

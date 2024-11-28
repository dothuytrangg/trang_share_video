import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { ConfigModule } from '@nestjs/config';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Category,VideoDetail]),ConfigModule],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}

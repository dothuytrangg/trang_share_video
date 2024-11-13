import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Tag } from './entities/tags.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tag]), ConfigModule],
  controllers: [TagsController],
  providers: [TagsService]
})
export class TagsModule {}

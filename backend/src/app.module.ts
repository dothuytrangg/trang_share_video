import { MessageModule } from './otp-message/message.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { VideosModule } from './videos/videos.module';
import { VideoDetailsController } from './video-details/video-details.controller';
import { VideoDetailsModule } from './video-details/video-details.module';
import { VerificationModule } from './verification/verification.module';
import { TagsModule } from './tags/tags.module';
import { TagsDetailController } from './tags-detail/tags-detail.controller';
import { TagsDetailService } from './tags-detail/tags-detail.service';
import { TagsDetailModule } from './tags-detail/tags-detail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    CategoriesModule,
    VideosModule,
    TagsModule,
    TagsDetailModule,
  ],
  controllers: [AppController, TagsDetailController],
  providers: [AppService, TagsDetailService],
})
export class AppModule {}

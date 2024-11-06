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

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    CategoriesModule,
    VideosModule,
    VideoDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

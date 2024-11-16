import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoDetailsService {
    constructor(@InjectRepository(VideoDetail) private videoDetailRepository:Repository<VideoDetail>,
                @InjectRepository(Video) private videoRepository:Repository<Video>,
                @InjectRepository(Category) private categoryRepository:Repository<Category>,
                // @InjectRepository(User) private userRepository: Repository<User>
            )
    {}
    async create(videoId:number,categoryId:number): Promise<Video> {
        let response = common_response;
       
        try {
            

          const video = await this.videoRepository.findOne({ where: { id:videoId },relations: ['user'] });

          if (!video) {
              throw new Error('Video not found');
          }
          // console.log(video);
          const category = await this.categoryRepository.findOne({ where: { id:categoryId } });
          if (!category) {
            throw new Error('Category not found');
        }
          let saveVideoDetail = await this.videoDetailRepository.save({video:video,category:category});
          console.log('save',saveVideoDetail);
          if (saveVideoDetail) {
          
            response.video = saveVideoDetail
            // response.video.userId = saveVideoDetail.user.id;
            return response;
          } else  {
            response.success = false;
          }
    
          return response;
        } catch (error) {
          response.success = false;
          response.message = error;
          return response;
        }
      }
}

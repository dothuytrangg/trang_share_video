import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { FilterVideoDetailDto } from 'src/video-details/dto/filter-video-detail.to';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Like, Repository } from 'typeorm';

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



      
      // async findAllByCategoryId(id:number):Promise<VideoDetail>{
      //   let response = common_response;
      
      //   let video_detail = await this.videoDetailRepository.find({
      //         where:{category:{id}},
      //         select:['id','video','user','category','created_at','updated_at'],
      //         relations:['video','user','category']
      //   })
      //   if(video_detail){
      //     response.success = true;
      //     response.data = video_detail;
      
      //     return response;
      //   }else{
      //     response.success = false;
      //   }
      //   return response;
      // }



      async findAllByCategoryId(id:number,query:FilterVideoDetailDto):Promise<VideoDetail>{
        let response = common_response;
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1)* items_per_page;
        // const keyword = query.search || '';

             
      const [res, total] = await this.videoDetailRepository.findAndCount({
        where:{category:{id}},
        order: {created_at:"DESC"},
        take:items_per_page,
        skip:skip,  
        select:['id','video','user','category','created_at','updated_at'],
        relations:['video','user','category']
       })
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        let video_detail = [res, total]
        if(video_detail){
          response.success = true;
          response.data = res;
          response.page = page;
          response.lastPage = lastPage;
          response.nextPage = nextPage;
          response.prevPage = prevPage;
          response.total = total;
          return response;
        }else{
          response.success = false;
        }
        return response;
      }
}

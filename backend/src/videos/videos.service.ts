import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { UpdateVideoDto } from 'src/videos/dto/update_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class VideosService {
    constructor(@InjectRepository(Video) private videoRepository:Repository<Video>,
                @InjectRepository(User) private userRepository: Repository<User>)
    {}

    async findAll():Promise<Video[]>{
        let response = common_response;
        let videos = await this.videoRepository.find({
            select:['id','name','description','slug','user','timeout','url','likes','dislike','viewed','thumbnail','position','is_hot','status','created_at','updated_at'],
            relations: ['user'],
        })
        if(videos){
            response.success = true;
            response.data = videos;
            return response;
        }else{
            response.success = false
        }
        return response;
    }
 
    async create(createVideoDto: CreateVideoDto,userId:number,thumbnail:string): Promise<Video> {
        let response = common_response;
        try {

          const user = await this.userRepository.findOne({ where: { id: userId } });

          if (!user) {
              throw new Error('User not found');
          }

          let saveVideo = await this.videoRepository.save({...createVideoDto,user:user,thumbnail:thumbnail});
          if (saveVideo) {
            response.video = saveVideo
            response.video.userId = saveVideo.user.id;
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
  async update(
        id: number,
        updateVideoDto: UpdateVideoDto,
        thumbnail:string
      ): Promise<UpdateResult> {
        let response = common_response;
      
        let updateVideo =  await this.videoRepository.update(id,{...updateVideoDto,thumbnail:thumbnail} );
        if(updateVideo.affected==1){
          response.data = updateVideo;
          response.success = true;
          return response;
        }else{
          response.success = false;
        }
      
        return response;
      }
 async delete(id: number): Promise<DeleteResult> {
    let response = common_response;
    let categories =  await this.videoRepository.delete(id);
    if(categories){
       response.success = true;
       return response;
    }else{
      response.success = false;
      
    }
    return response;
    // return await this.categoryRepository.delete(id);
  }

      
}

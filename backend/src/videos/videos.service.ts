import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { Repository } from 'typeorm';

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
 
    async create(createVideoDto: CreateVideoDto,userId:number): Promise<Video> {
        let response = common_response;
        try {

          const user = await this.userRepository.findOne({ where: { id: userId } });

          if (!user) {
              throw new Error('User not found');
          }

          let saveVideo = await this.videoRepository.save({...createVideoDto,user:user});
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
}

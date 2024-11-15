import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { FilterVideoDto } from 'src/videos/dto/filter-user.dto';
import { UpdateVideoDto } from 'src/videos/dto/update_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { SearchVideoDto } from './dto/search-video.dto';

@Injectable()
export class VideosService {
    constructor(@InjectRepository(Video) private videoRepository:Repository<Video>,
                @InjectRepository(User) private userRepository: Repository<User>)
    {}

    // async findAll():Promise<Video[]>{
    //     let response = common_response;
    //     let videos = await this.videoRepository.find({
    //         select:['id','name','description','slug','user','timeout','url','likes','dislike','viewed','thumbnail','position','is_hot','status','created_at','updated_at'],
    //         relations: ['user'],
    //     })
    //     if(videos){
    //         response.success = true;
    //         response.data = videos;
    //         return response;
    //     }else{
    //         response.success = false
    //     }
    //     return response;
    // }
    async findAllPage(query:FilterVideoDto):Promise<any>{
      let response = common_response;
      const items_per_page = Number(query.items_per_page) || 3;
      const page = Number(query.page) || 1;
      const skip = (page - 1)* items_per_page;
      const keyword = query.search || '';
      const [res, total] = await this.videoRepository.findAndCount({
          where:[
              {name: Like('%' + keyword + '%')},
            
          ],
          order: {created_at:"DESC"},
          take:items_per_page,
          skip:skip,
          select:['id','name','description','slug','user','timeout','url','likes','dislike','viewed','thumbnail','position','is_hot','status','created_at','updated_at'],
          relations: ['user'],
      })
      const lastPage = Math.ceil(total / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      let ok = [res, total]
      if(ok){
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
  async findOne(id:number):Promise<Video>{
    let response = common_response;
    let video = await this.videoRepository.findOneBy({id});
    if(video){
      response.success = true;
      response.data = video;
      return response;
    }else{
      response.success = false;
    }
    return response;
  }



 
    async create(createVideoDto: CreateVideoDto,userId:number,thumbnail:string,video:string): Promise<Video> {
        let response = common_response;
        try {

          const user = await this.userRepository.findOne({ where: { id: userId } });

          if (!user) {
              throw new Error('User not found');
          }
          
          
          let saveVideo = await this.videoRepository.save({...createVideoDto,user:user,thumbnail:thumbnail,url:video});
          if (saveVideo) {
            response.success = true;

            response.video = saveVideo
            
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
        thumbnail?:string,
        
      ): Promise<UpdateResult> {
        let response = common_response;
      
        // Lấy video hiện tại để kiểm tra và lưu `thumbnail` cũ nếu cần
        const existingVideo = await this.videoRepository.findOneBy({ id });
        if (!existingVideo) {
            throw new NotFoundException('Video not found');
        }
    
          //  const updateVideo = await this.videoRepository.update(id, {
          //   ...updateVideoDto,
          
        // Nếu không có `thumbnail` mới, giữ lại `thumbnail` cũ
        // const thumbnailToSave = thumbnail || existingVideo.thumbnail;
        
       // Determine if a new thumbnail should be saved or keep the existing one
        const thumbnailToSave = thumbnail && thumbnail !== existingVideo.thumbnail
        ? thumbnail
        : existingVideo.thumbnail;
        
        // Perform the update with the determined thumbnail
      const updateResult = await this.videoRepository.update(id, {
        ...updateVideoDto,
        thumbnail: thumbnailToSave,
      });

        if(updateResult.affected==1){
          response.data = updateResult;
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

  async searchVideos(filters: SearchVideoDto): Promise<any> {
    const queryBuilder = this.videoRepository.createQueryBuilder('video');
    let whereAdded = false;

    // Kiểm tra filters trước khi dùng trong câu truy vấn
    if (filters.name && typeof filters.name === 'string' && filters.name.trim() !== '') {
      queryBuilder.where('video.name LIKE :name', { name: `%${filters.name}%` });
      whereAdded = true;
    }

    if (filters.description && typeof filters.description === 'string' && filters.description.trim() !== '') {
      if (whereAdded) {
        queryBuilder.andWhere('video.description LIKE :description', { description: `%${filters.description}%` });
      } else {
        queryBuilder.where('video.description LIKE :description', { description: `%${filters.description}%` });
        whereAdded = true;
      }
    }

    if (filters.slug && typeof filters.slug === 'string' && filters.slug.trim() !== '') {
      if (whereAdded) {
        queryBuilder.andWhere('video.slug LIKE :slug', { slug: `%${filters.slug}%` });
      } else {
        queryBuilder.where('video.slug LIKE :slug', { slug: `%${filters.slug}%` });
        whereAdded = true;
      }
    }

    if (filters.url && typeof filters.url === 'string' && filters.url.trim() !== '') {
      if (whereAdded) {
        queryBuilder.andWhere('video.url LIKE :url', { url: `%${filters.url}%` });
      } else {
        queryBuilder.where('video.url LIKE :url', { url: `%${filters.url}%` });
        whereAdded = true;
      }
    }

    try {
      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error executing query:', error);  // In ra lỗi để debug
      throw new Error('Internal server error');
    }
  }



      
}

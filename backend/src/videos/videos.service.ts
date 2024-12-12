import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { History } from 'src/histories/entities/histories.entity';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { FilterVideoDto } from 'src/videos/dto/filter-video.dto';
import { UpdateVideoDto } from 'src/videos/dto/update_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { DeleteResult, Like, QueryFailedError, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class VideosService {
    constructor(@InjectRepository(Video) private videoRepository:Repository<Video>,
                @InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(VideoDetail) private videoDetailRepository: Repository<VideoDetail>,
                @InjectRepository(Category) private categoryRepository: Repository<Category>,
                @InjectRepository(History) private historyRepository: Repository<History>

                
                
              )
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
      const items_per_page = Number(query.items_per_page) || 10;
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

  async getVideoForHomePage(query:FilterVideoDto):Promise<any>{
    let response = common_response;
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1)* items_per_page;
    const keyword = query.search || '';
   
    const [res, total] = await this.videoRepository.findAndCount({
        where:[
            {status:'confirmed'}
          
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
    const video = await this.videoRepository.findOne({
        where: { id },
        relations: ['user'], 
    });

    if(video){
      response.success = true;
      response.data = video;
      return response;
    }else{
      response.success = false;
    }
    return response;
  }



 

    async create(
      createVideoDto: CreateVideoDto,
      userId: number,
      thumbnail: string,
      video: string,
      categories: number[] , 
      videoDuration:number
  ): Promise<any> {
      let response = common_response;
      try {
         
          const user = await this.userRepository.findOne({ where: { id: userId } });
  
          if (!user) {
              throw new Error('User not found');
          }
          const pinnedCategory = await this.categoryRepository.findOne({
            where: { status: 2 },
            select: ['id', 'name', 'description', 'slug', 'status', 'created_at'],
          });
   

          
  
     
          const saveVideo = await this.videoRepository.save({
              ...createVideoDto,
              user: user,
              thumbnail: thumbnail,
              url: video,
              timeout: videoDuration,
              status:user.role ===3 ? 'confirmed' : 'confirming'
          });
  
          if (!saveVideo) {
              response.success = false;
              response.message = 'Failed to save video';
              return response;
          }
          
        
       
          categories.push(pinnedCategory.id)
          
       
          const videoDetails = categories.map((categoryId) => {
              return this.videoDetailRepository.create({
                  video: saveVideo,
                  category: { id: categoryId },
                  user:user
              });
          });
  
       
          await this.videoDetailRepository.save(videoDetails);
  
          response.success = true;
          response.video = saveVideo;
          response.videoDetails = videoDetails;
          return response;
  
      } catch (error) {
          
        console.error('Error:', error);
        // if (error instanceof QueryFailedError) {
        //   if (error.driverError.code === 'ER_DUP_ENTRY') { 
        //     response.success = false;
        //     response.message = `User with email  ${createUserDto.email} already exists.`
        //     response.statusCode =400
        //     return response;    
        //   }
        // }
        // response.success = false;
        // response.message = "An unexpected error occurred."
        // response.statusCode=500
       
        // throw new InternalServerErrorException("An unexpected error occurred.");
     
      }
      return response;
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
        thumbnail: thumbnailToSave
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
    
        try {
            await this.historyRepository.delete({ video: { id } });
            await this.videoDetailRepository.delete({ video: { id } });
           
    
            const deleteResult = await this.videoRepository.delete(id);
    
            if (deleteResult.affected === 1) {
                response.success = true;
                response.message = 'Video and related details deleted successfully';
            } else {
                response.success = false;
                response.message = 'Failed to delete video';
            }
    
            return response;
        } catch (error) {
            response.success = false;
            response.message = error.message || 'An error occurred while deleting the video';
            return response;
        }
    }

    handleFileValidationError(errorMessage: string) {
      // let response = {
      //     success: false,
      //     message: errorMessage,
      // };
      let response = common_response;
      response.success = false;
      response.message = errorMessage

      return response;
  }

  async searchVideo(query: FilterVideoDto): Promise<any> {
    let response = common_response;
    const keyword = query.search || '';

    // console.log('Searching for videos with keyword:', keyword);

   
    const searchConditions = [
      { name: Like(`%${keyword}%`) },
      { description: Like(`%${keyword}%`) },
      { url: Like(`%${keyword}%`) },
      { slug: Like(`%${keyword}%`) },
      
    ];

    const res = await this.videoRepository.find({
      where: searchConditions,
      order: { created_at: 'DESC' },
      select: [
        'id', 'name', 'description', 'slug', 'user', 'timeout', 'url',
        'likes', 'dislike', 'viewed', 'thumbnail', 'position', 'is_hot',
        'status', 'created_at', 'updated_at'
      ],
      relations: ['user'],
    });

    
    if (res.length > 0) {
      response.success = true;
      response.data = res;
      response.total = res.length;  
      return response;
    } else {
      response.success = false;
      response.message = 'No videos found!';
    }

    return response;
  }

  async incrementViews(videoId: number,userId?:number): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new Error('Video not found');
    }
    video.viewed += 1;
    return this.videoRepository.save(video);
  }
  
      
}

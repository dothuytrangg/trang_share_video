import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/histories/entities/histories.entity';
import { common_response } from 'src/ultils/common';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class HistoriesService {
    constructor(@InjectRepository(Video) private videoRepository:Repository<Video>,
              @InjectRepository(User) private userRepository: Repository<User>,
              @InjectRepository(History) private historyRepository: Repository<History>)
{}


async findByUserId(userId: number):Promise<History>  {
    let response = common_response;

    let user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        response.success = false;
        response.message = 'User not found';
        return response;
    }

    let histories = await this.historyRepository.find({
        where: { user: {id:userId} },
        select: ['id', 'video', 'user', 'created_at', 'updated_at'],
        relations: ['user', 'video'],
        order: {created_at:"DESC"},
    });

    if (histories.length > 0) {
        response.success = true;
        response.data = histories;
    } else {
        response.success = false;
        response.message = 'No histories found';
    }

    return response;
}

async create(videoId: number, userId: number): Promise<any> {
    let response = common_response;

   
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!video) {
        console.log('Video not found');
        response.success = false;
        response.message = 'Video not found';
        return response;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        console.log('User not found');
        response.success = false;
        response.message = 'User not found';
        return response;
    }

 
    const existingHistory = await this.historyRepository.findOne({
        where: { video: { id: videoId }, user: { id: userId } },
    });

 
    if (existingHistory) {
        await this.historyRepository.delete(existingHistory.id);
    }

    const history = this.historyRepository.create({
        video: video,
        user: user,
    });

    const historySaved = await this.historyRepository.save(history);

    if (historySaved) {
        response.success = true;
        response.data = historySaved;
    } else {
        response.success = false;
        response.message = 'Failed to create history';
    }

    return response;
}


async deleteHistory(videoId: number):Promise<DeleteResult>  {
  let response = common_response;
  try {
  
    let histories =  await this.historyRepository.delete({video:{id:videoId}});
    if( histories){
      response.success = true;
      response.data = histories
      return response;
    }else{
      response.success = false;
      
    }
      return response;
    } catch (error) {
        response.success = false;
        response.message = error.message || 'An error occurred while deleting the history';
        return response;
    }
}
    
}

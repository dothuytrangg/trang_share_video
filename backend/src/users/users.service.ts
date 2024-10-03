import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FilterUserDto } from 'src/users/dto/filter-user.dto';
import { common_response } from 'src/ultils/common';


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>){}

    async findAll():Promise<User[]>{
        let response = common_response;
        let users = await this.userRepository.find({
            select:['id','full_name','email','status','created_at','updated_at']
        })
        if(users){
            response.success = true;
            response.data = users;
            return response;
        }else{
            response.success = false
        }
        return response;
    }
    // async findAll(query:FilterUserDto):Promise<any>{
    //     const items_per_page = Number(query.items_per_page) || 10;
    //     const page = Number(query.page) || 1;
    //     const skip = (page - 1)* items_per_page;
    //     const keyword = query.search || '';
    //     const [res, total] = await this.userRepository.findAndCount({
    //         where:[
    //             {full_name: Like('%' + keyword + '%')},
    //             {email: Like('%' + keyword + '%')},

    //         ],
    //         order: {created_at:"DESC"},
    //         take:items_per_page,
    //         skip:skip,
    //         select:['id','full_name','email','status','created_at','updated_at']

    //     })
    //     const lastPage = Math.ceil(total / items_per_page);
    //     const nextPage = page + 1 > lastPage ? null : page + 1;
    //     const prevPage = page - 1 < 1 ? null : page - 1;

    //     return {
    //         data: res,
    //         total,
    //         currenPage:page,
    //         nextPage,
    //         prevPage,
    //         lastPage
    //     }

    // }


    async findOne(id:number):Promise<User>{
        return await this.userRepository.findOneBy({id});
    }

    async create(CreateUserDto:  CreateUserDto): Promise<User> {
        let response = common_response;
        try {
          const hashPassword = await this.hashPassword(CreateUserDto.password);
          let user = await this.userRepository.save({...CreateUserDto, refresh_token: 'refresh_token_string',
            password: hashPassword})
          if (user) {
            response.user = user
            return response;
          } else {
            response.success = false;
          }
          return response;
        } catch (error) {
          response.success = false;
          response.message = error;
          return response;
        }
      
      }
    async update(id:number,updateUserDto:UpdateUserDto):Promise<UpdateResult>{
      let response = common_response;
  
      let updateUser =  await this.userRepository.update(id,updateUserDto);
      if(updateUser){
        response.success = true;
        return response;
      }else{
        response.success = false;
      }
    
      return response;
    }

    async delete(id:number):Promise<DeleteResult>{
      let response = common_response;

      let deleteUser  = await this.userRepository.delete(id);
      if(deleteUser){
        response.success = true;
        return response;
      }
      else{
        response.success = false
      }
        return response;
    }
    private async hashPassword(password: string): Promise<string> {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hash = await bcrypt.hash(password, saltRound);
      return hash;
    }

    async uploadAvatar(id:number,avatar:string):Promise<UpdateResult>{
        return await this.userRepository.update(Number(id),{avatar});
    }
}
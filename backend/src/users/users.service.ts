import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FilterUserDto } from 'src/users/dto/filter-user.dto';
import { common_response } from 'src/ultils/common';
import validator from 'validator';


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>){}

    // async findAll():Promise<User[]>{
    //     let response = common_response;
    //     let users = await this.userRepository.find({
    //         select:['id','full_name','email','role','status','created_at','updated_at']
    //     })
    //     if(users){
    //         response.success = true;
    //         response.data = users;
    //         return response;
    //     }else{
    //         response.success = false
    //     }
    //     return response;
    // }
    async findAllPage(query:FilterUserDto):Promise<any>{
        let response = common_response;
        const items_per_page = Number(query.items_per_page) || 3;
        const page = Number(query.page) || 1;
        const skip = (page - 1)* items_per_page;
        const keyword = query.search || '';
        const [res, total] = await this.userRepository.findAndCount({
            where:[
                {full_name: Like('%' + keyword + '%')},
                {email: Like('%' + keyword + '%')},

            ],
            order: {created_at:"DESC"},
            take:items_per_page,
            skip:skip,
            select:['id','full_name','email','role','avatar','status','created_at','updated_at']

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


    // async findOne(id:number):Promise<User>{
    //   let response = common_response;
    //   let user = await this.userRepository.findOne({
    //         where:{id:id},
    //         select:['id','full_name','email','role','avatar','status','created_at','updated_at'],
    //         relations:['videos']
    //   })
    //   if(user){
    //     response.success = true;
    //     response.data = user;
    //     return response;
    //   }else{
    //     response.success = false;
    //   }
    //   return response;
    // }
    async findOne(id: number): Promise<any> {
      let response = common_response;
  
      try {
          const user = await this.userRepository.findOne({
              where: { id: id },
              select: ['id', 'full_name', 'email', 'password', 'role', 'avatar', 'status', 'created_at', 'updated_at'],
          });
  
          if (user) {
              response.success = true;
              response.data = user;
          } else {
              response.success = false;
              response.message = 'User not found';
          }
      } catch (error) {
          response.success = false;
          response.message = error.message || 'An unexpected error occurred';
      }
  
      return response;
  }
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    let response = common_response;

    try {
      // Validate email existence and format
      if (!validator.isEmail(CreateUserDto.email)) {
        response.success = false;
        response.message = 'Email must be a valid email.';
        return response;  
      }

      // const emailExist = await this.userRepository.findOne({
      //   where: {email: CreateUserDto.email },
      // });
      // if(emailExist){
      //   response.success = false;
      //   response.message = 'Email already exists.';
      //   return response;
      // }
      // Hash the password
      const hashPassword = await this.hashPassword(CreateUserDto.password);

      // Create the user
      let user = await this.userRepository.save({
        ...CreateUserDto,
        refresh_token: 'refresh_token_string',
        password: hashPassword,
      });

      if (user) {
        response.success = true;  
        response.user = user;
      } else {
        response.success = false;
        response.message = 'User creation failed.';
      }
    } catch (error) {
      response.success = false;
      response.message = error.message || 'An unexpected error occurred.';
    }

    return response;
  }

    async update(id:number,updateUserDto:UpdateUserDto):Promise<UpdateResult>{
      let response = common_response;
      
      if (updateUserDto.password) {
     
        const hashPassword = await this.hashPassword(updateUserDto.password);
        updateUserDto.password = hashPassword;
    }
      let updateUser =  await this.userRepository.update(id,updateUserDto);
      if(updateUser){
        response.success = true;
        return response;
      } else if (!updateUserDto.full_name){
        response.success = false;
        response.message = 'Full name cannot be empty';
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
      let response = common_response;
      let upload = await this.userRepository.update(Number(id),{avatar});
      if(upload){
        response.success = true;
        return response;
      }else{
        response.success = false;
      }
      return response;
        
    }
}
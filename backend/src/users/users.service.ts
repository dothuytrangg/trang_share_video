import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { DeleteResult, Like, QueryFailedError, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FilterUserDto } from 'src/users/dto/filter-user.dto';
import { common_response } from 'src/ultils/common';
import validator from 'validator';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Verification } from 'src/verification/entities/verification.entity';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(VideoDetail) private videoDetailRepository: Repository<VideoDetail>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Verification) private verifyRepository: Repository<Verification>

  ) { }

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
  async findAllPage(query: FilterUserDto): Promise<any> {
    let response = common_response;
    const items_per_page = Number(query.items_per_page) || 3;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.search || '';
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { full_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },

      ],
      order: { created_at: "DESC" },
      take: items_per_page,
      skip: skip,
      select: ['id', 'full_name', 'email', 'role', 'avatar', 'status', 'created_at', 'updated_at']

    })
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    let ok = [res, total]
    if (ok) {
      response.success = true;
      response.data = res;
      response.page = page;
      response.lastPage = lastPage;
      response.nextPage = nextPage;
      response.prevPage = prevPage;
      response.total = total;
      return response;
    } else {
      response.success = false;
    }

    return response;

  }


  async findOne(id: number): Promise<User> {
    let response = common_response;
    let user = await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'full_name', 'email', 'role', 'avatar', 'status', 'created_at', 'updated_at'],
      relations: ['videos']
    })
    if (user) {
      response.success = true;
      response.data = user;
      return response;
    } else {
      response.success = false;
    }
    return response;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let response = common_response;
    try {
      const hashPassword = await this.hashPassword(createUserDto.password);

      const user = await this.userRepository.save({ ...createUserDto, password: hashPassword });
      if (user) {
        response.success = true
        response.user = user


      } else {
        response.success = false
      }



      // Trả về thành công
      return response;
    } catch (error) {

      console.error('Error:', error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') {
          response.success = false;
          response.message = `User with email  ${createUserDto.email} already exists.`
          response.statusCode = 400
          return response;
          // throw new BadRequestException(`Category with name  ${createCategoryDto.name} already exists.`);

        }
      }
      response.success = false;
      response.message = "An unexpected error occurred."
      response.statusCode = 500

      // throw new InternalServerErrorException("An unexpected error occurred.");

    }
    return response;
  }


  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<any> {
    let response = common_response;
    try {
      console.log('Requested ID:', id);

      const user = await this.userRepository.findOne({
        where: { id },
      });
      console.log("user", user)

      if (!user) {
        response.success = false;
        response.message = 'User not found.';
        return response;
      }

      const passwordMatch = await bcrypt.compare(changePasswordDto.old_password, user.password);
      if (!passwordMatch) {
        response.success = false;
        response.message = 'Incorrect old password.';
        return response;
      }

      // Ensure password and confirm_password match
      if (changePasswordDto.password !== changePasswordDto.confirm_password) {
        response.message = 'Password and confirm password do not match.';
        return response;
      }

      // Check if the new password is the same as the old one
      if (changePasswordDto.old_password === changePasswordDto.password) {
        response.success = false;
        response.message = 'New password cannot be the same as the old password.';
        return response;
      }

      // Hash the new password
      const hashPassword = await this.hashPassword(changePasswordDto.password);

      // Update the user's password
      const updateResult = await this.userRepository.update(id, { password: hashPassword });

      console.log('Update result:', updateResult);

      if (updateResult.affected === 1) {
        response.success = true;
        response.message = 'Password updated successfully.';
      } else {
        response.message = 'Failed to update the password. User not found or no changes made.';
      }
    } catch (error) {
      console.error('Error updating password:', error);
      response.message = 'An unexpected error occurred while updating the password.';
    }

    return response;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    let response = common_response;

    if (updateUserDto.password) {

      const hashPassword = await this.hashPassword(updateUserDto.password);
      updateUserDto.password = hashPassword;
    }
    let updateUser = await this.userRepository.update(id, updateUserDto);
    if (updateUser) {
      response.success = true;
      return response;
    } else if (!updateUserDto.full_name) {
      response.success = false;
      response.message = 'Full name cannot be empty';
    } else {
      response.success = false;
    }

    return response;
  }

  async delete(id: number): Promise<DeleteResult> {
    let response = common_response;
    try {


      await this.verifyRepository.delete({ userId: id })
      await this.videoDetailRepository.delete({ user: { id } });
      await this.videoRepository.delete({ user: { id } });
      let deleteUser = await this.userRepository.delete(id);
      if (deleteUser) {
        response.success = true;
        return response;
      }
      else {
        response.success = false
      }
      return response;

    } catch (error) {

      response.success = false;
      response.message = error.message || 'An error occurred while deleting the user';
      return response;

    }
  }

  //   async delete(id: number): Promise<DeleteResult> {
  //     let response = common_response;

  //     try {

  //         await this.videoDetailRepository.delete({ user: { id } });

  //         const deleteResult = await this.userRepository.delete(id);

  //         if (deleteResult.affected === 1) {
  //             response.success = true;
  //             response.message = 'User and related details deleted successfully';
  //         } else {
  //             response.success = false;
  //             response.message = 'Failed to delete user';
  //         }

  //         return response;
  //     } catch (error) {
  //         response.success = false;
  //         response.message = error.message || 'An error occurred while deleting the user';
  //         return response;
  //     }
  // }
  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, saltRound);
    return hash;
  }

  async uploadAvatar(id: number, avatar: string): Promise<UpdateResult> {
    console.log('avatar: ', avatar);
    let response = common_response;
    let upload = await this.userRepository.update(Number(id), { avatar });
    let user = await this.userRepository.findOne({
      where: { id: Number(id) },
      select: ['id', 'full_name', 'email', 'role', 'avatar', 'status', 'created_at', 'updated_at'],
    });
    console.log('upload: ', upload);
    if (upload && user) {
      response.success = true;
      response.user = user;
      return response;
    } else {
      response.success = false;
    }
    return response;

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
}
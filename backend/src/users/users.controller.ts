import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FilterUserDto } from 'src/users/dto/filter-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { storageConfig } from 'helpers/config';

@Controller('users')
export class UsersController {

    constructor(private userService:UsersService){}
    @UseGuards(AuthGuard)
    @Get()
    FindAllPage(@Query() query: FilterUserDto):Promise<User[]>{
        // console.log(query);
        return this.userService.findAllPage(query);
    }
    // @UseGuards(AuthGuard)
    // @Get()
    // FindAll():Promise<User[]>{
    //     return this.userService.findAll();
    // }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id:string):Promise<User>{
        return this.userService.findOne(Number(id));
    }
       
    @UseGuards(AuthGuard)
    // @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createUserDto:CreateUserDto):Promise<User>{
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Param('id') id:string,@Body() updateUserDto:UpdateUserDto){
        return this.userService.update(Number(id),updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id:string){
        return this.userService.delete(Number(id));
    }

    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar',{
        storage:storageConfig('avatar'),
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.png','.jpeg'];
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null,false);
            }else{
                const fileSize = parseInt(req.headers['content-length']);
                if(fileSize > 1024 * 1024 * 5 ){
                    req.fileValidationError = 'File size is too large.Accepted size is less than';
                    cb(null,false);
                }else{
                    cb(null,true)
                }
            }


        }

        }))

    uploadAvatar(@Req() req:any,@UploadedFile() file:Express.Multer.File){
        console.log("upload avavar");
        console.log('user data',req.user_data)
        console.log(file)

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError )
        }
        if(!file){
            throw new BadRequestException('File is required');
        }

        return this.userService.uploadAvatar(req.user_data.id,file.destination + '/' + file.filename);
    }

}

import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FilterUserDto } from 'src/users/dto/filter-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { storageConfig } from 'helpers/config';
import fs, { readFileSync, unlink } from 'fs'
import WebDav from 'src/ultils/WebDav';
import { AdminAuth } from 'src/auth/admin.guard';
@Controller('users')
export class UsersController {
    

    constructor(private userService: UsersService){}
    @UseGuards(AuthGuard)
    @Get()
    FindAllPage(@Query() query: FilterUserDto):Promise<User[]>{
        // console.log(query);
        return this.userService.findAllPage(query);

    }

    @UseGuards(AuthGuard)
    @Get('profile')
    Profile(@Req() req:any):Promise<User>{
        
        return this.userService.findOne(Number(req.user_data.id))
    }
    

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
    // @UseGuards(AdminAuth)
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
        storage:storageConfig('avatars'),
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.png','.jpeg','.webp','.PNG','.JPG'];
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
    async uploadAvatar(@Req() req:any,@UploadedFile() file:Express.Multer.File){

        // console.log("upload avavar");
        // console.log('user data',req.user_data)
        console.log(file)

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError )
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        let fileName = file.filename;
        let fileContent = readFileSync(file.path);
        WebDav.put('avatars/'+fileName,fileContent).then(res=>{
            if(res.status == 201){
                // remove
               unlink(file.path,(err)=>{
                if (err) throw err;
               
               });
            }
        }).catch((e=>{

        }))
        return this.userService.uploadAvatar(req.user_data.id,file.filename); 
    }
    
}



import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import WebDav from 'src/ultils/WebDav';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { FilterVideoDto } from 'src/videos/dto/filter-user.dto';
import { UpdateVideoDto } from 'src/videos/dto/update_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { VideosService } from 'src/videos/videos.service';

@Controller('videos')
export class VideosController {
    constructor(private videoService:VideosService){}

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query:FilterVideoDto):Promise<Video[]>{
        return this.videoService.findAllPage(query)
    }



    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id:string):Promise<Video>{
        return this.videoService.findOne(Number(id));
    }
        
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail',{
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
    create(@Req() req:any,@Body() createVideoDto:CreateVideoDto,@UploadedFile() file:Express.Multer.File):Promise<Video>{
        const userId = req.user_data.id;
        console.log('user data',req.user_data)
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
                //remove
            //    unlink(file.path,(err)=>{
            //     if (err) throw err;
               
            //    });
            }
        }).catch((e=>{

        }))
        return this.videoService.create(createVideoDto,userId,file.filename);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail',{
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
    update(@Param('id') id:string,@Body() updateVideoDto:UpdateVideoDto,@Req() req:any,@UploadedFile() file:Express.Multer.File){
        // let existing = this.videoService.findOne(Number(id));
        // if(updateVideoDto.thumbnail == existing.thumbnail){

        // }
        console.log(file)
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError )
        }
        if(!file){
            if(updateVideoDto.thumbnail != null){
                return this.videoService.update(Number(id),updateVideoDto,updateVideoDto.thumbnail);
            }
            throw new BadRequestException('File is required');
        }
        let fileName = file.filename;
        let fileContent = readFileSync(file.path);
        WebDav.put('avatars/'+fileName,fileContent).then(res=>{
            if(res.status == 201){
                //remove
            //    unlink(file.path,(err)=>{
            //     if (err) throw err;
               
            //    });
            }
        }).catch((e=>{

        }))
        return this.videoService.update(Number(id),updateVideoDto,file.filename);
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id:string){
        return this.videoService.delete(Number(id));
    }

    
}

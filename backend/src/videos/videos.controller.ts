import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { readFileSync, unlink } from 'fs';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import WebDav from 'src/ultils/WebDav';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { VideoDetailsService } from 'src/video-details/video-details.service';
import { CreateVideoDto } from 'src/videos/dto/create_video.dto';
import { FilterVideoDto } from 'src/videos/dto/filter-user.dto';
import { UpdateVideoDto } from 'src/videos/dto/update_video.dto';
import { Video } from 'src/videos/entities/videos.entity';
import { VideosService } from 'src/videos/videos.service';

@Controller('videos')
export class VideosController {
    constructor(private videoService:VideosService
    ){}

    // @UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query:FilterVideoDto):Promise<Video[]>{
        return this.videoService.findAllPage(query)
    }

    // @Get("videoHomePage")
    // getVideoHomePage(@Query() query:FilterVideoDto):Promise<Video[]>{
    //     return this.videoService.getVideoForHomePage(query)
    // }




    // @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id:string):Promise<Video>{
        return this.videoService.findOne(Number(id));
    }

   

    
        
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()


    @UseInterceptors(FileFieldsInterceptor([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'url', maxCount: 1 },
      ],
      {
        storage:storageConfig('videos'),
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.png','.jpeg','.webp','.PNG','.JPG','.webm','.mp4','.mov'];
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null,false);
            }else{
                const fileSize = parseInt(req.headers['content-length']);
                if(fileSize > 1024 * 1024 * 1024 * 10 ){
                    req.fileValidationError = 'File size is too large. Accepted size is less than 10GB.';
                    cb(null,false);
                   
                }else {
                    //  console.log(ext)
                    cb(null, true);
                  }
            }

        }
      }

    ))



    create(@Req() req:any,@Body() createVideoDto:CreateVideoDto, @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; url?: Express.Multer.File[] }){
        const userId = req.user_data.id;
        if (!Array.isArray(createVideoDto.categories)) {
            createVideoDto.categories = [createVideoDto.categories];
          }

        // const fs = require('fs');
        // console.log('user data',req.user_data)
        const thumbnail = files.thumbnail ? files.thumbnail[0] : null;
        const video = files.url ? files.url[0] : null;
        console.log('files.thumbnail: ', files.thumbnail);
        console.log('files.video: ', files.url);

        console.log('file',files);
        // this.move()
        // console.log('video',video);

        // if(req.fileValidationError){
        //     throw new BadRequestException(req.fileValidationError )
        // }
        // if(!thumbnail ||  !video){
        //     throw new BadRequestException('Thumbnail and video files are required');
        // }


        if (req.fileValidationError) {
            return this.videoService.handleFileValidationError(req.fileValidationError);
        }
    
        if (!files.thumbnail || !files.url) {
            throw new BadRequestException('Thumbnail and video files are required');
        }
    
        //thumbnail;
        let fileName_thumbnail = thumbnail.filename;
        let fileContent_thumbnail = readFileSync(thumbnail.path);
        WebDav.put('videos/'+fileName_thumbnail,fileContent_thumbnail).then(res=>{
            if(res.status == 201){
                // remove
               unlink(thumbnail.path,(err)=>{
                if (err) throw err;
               
               });
            }
        }).catch((e=>{

        }))

         //thumbnail;
         let fileName_video = video.filename;
         let fileContent_video = readFileSync(video.path);
         WebDav.put('videos/'+fileName_video,fileContent_video).then(res=>{
             if(res.status == 201){
                 //remove
                unlink(video.path,(err)=>{
                 if (err) throw err;
                
                });
             }
         }).catch((e=>{
 
         }))
     
         
        return this.videoService.create(createVideoDto,userId,thumbnail.filename,video.filename,createVideoDto.categories);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail',{
        // storage:storageConfig('avatars'),
        storage:storageConfig('videos'),
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
        if (req.fileValidationError) {
            return this.videoService.handleFileValidationError(req.fileValidationError);
        }
        if(!file){
            if(updateVideoDto.thumbnail != null ){
                return this.videoService.update(Number(id),updateVideoDto,updateVideoDto.thumbnail);
            }
            throw new BadRequestException('File is required');
        }
        let fileName = file.filename;
        let fileContent = readFileSync(file.path);
        WebDav.put('videos/'+fileName,fileContent).then(res=>{
            if(res.status == 201){
                //remove
               unlink(file.path,(err)=>{
                if (err) throw err;
               
               });
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

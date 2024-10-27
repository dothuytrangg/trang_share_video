import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync, createReadStream } from 'fs';
import path, { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  // @Get('image')
  // image(){
  //         // return 3;
  //     return readFileSync('uploads/avatar/1729937828293-thumb-nail-69.jpg');
  // }
  @Get('resource/:folder/:name')
  getFile(@Param('name') name:string, @Param('folder') folder:string): StreamableFile {
    // console.log('`uploads/${folder}/${name}`: ', `uploads/${folder}/${name}`);
    const file = createReadStream(join(process.cwd(),  `uploads/${folder}/${name}`));
    return new StreamableFile(file);
  }
}

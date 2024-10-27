import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync, createReadStream } from 'fs';
import { join } from 'path';

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
  @Get('avatars/:name')
  getFile(@Param('name') name:string): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'uploads/avatars/'+name));
    return new StreamableFile(file);
  }
}

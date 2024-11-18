import { User } from './../users/entities/users.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tags.entity';
import { FilterCategoryDto } from 'src/categories/dto/filter-category.dto';
import { Category } from 'src/categories/entities/categories.entity';
import { FilterTagDto } from './dto/filter-tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminAuth } from 'src/auth/admin.guard';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
    constructor(private tagService: TagsService) {}
    
    @UseGuards(AdminAuth)
    @UsePipes(ValidationPipe)
    @Post()
    createTag(@Req() req: any, @Body() createTagDto: CreateTagDto): Promise<any> {
        console.log('User Data from Request:', req.user_data);  // In ra user_data để kiểm tra
        const userId = req.user_data?.id;
        if (!userId) {
            throw new UnauthorizedException('User ID is required to create a tag');
        }
        return this.tagService.createTag(createTagDto, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Tag> {
        return this.tagService.findOne(Number(id));
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(@Query() query: FilterTagDto): Promise<Tag[]> {
        // console.log(query);
        return this.tagService.findAll(query);
    }

    @Put(':id')
    @UseGuards(AdminAuth)
    @UsePipes(ValidationPipe)
    update(@Param('id') id:string, @Body() UpdateTagDto:UpdateTagDto){
        return this.tagService.updateTag(Number(id), UpdateTagDto);
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        
        return this.tagService.delete(Number(id));
    }

    @Get("/all")
    findAllTags(): Promise<Tag[]> {
        return this.tagService.findAllTags();
        

}
}

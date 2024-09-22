import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminAuth } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
// import { AuthGuard } from '';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { Category } from 'src/categories/entities/categories.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService:CategoriesService){}

    @UseGuards(AdminAuth)
    @Get()
    findAll():Promise<Category[]>{
        
        return this.categoryService.findAll();
    }


    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id:string):Promise<Category>{
        return this.categoryService.findOne(Number(id));
    }
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createCategoryDto:CreateCategoryDto):Promise<Category>{
        return this.categoryService.create(createCategoryDto);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Param('id') id:string,@Body() updateCategoryDto:UpdateCategoryDto){
        return this.categoryService.update(Number(id),updateCategoryDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id:string){
        return this.categoryService.delete(Number(id));
    }
}

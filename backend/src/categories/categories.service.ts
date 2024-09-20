import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { Category } from 'src/categories/entities/categories.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private categoryRepository:Repository<Category>){}
    
    async findAll():Promise<Category[]>{
        return await this.categoryRepository.find({
            select:['id','name','description','slug','status','created_at','updated_at']
        })
    }
    // async findAll(query:FilterUserDto):Promise<any>{
    //     const items_per_page = Number(query.items_per_page) || 10;
    //     const page = Number(query.page) || 1;
    //     const skip = (page - 1)* items_per_page;
    //     const keyword = query.search || '';
    //     const [res, total] = await this.userRepository.findAndCount({
    //         where:[
    //             {full_name: Like('%' + keyword + '%')},
    //             {email: Like('%' + keyword + '%')},

    //         ],
    //         order: {created_at:"DESC"},
    //         take:items_per_page,
    //         skip:skip,
    //         select:['id','full_name','email','status','created_at','updated_at']

    //     })
    //     const lastPage = Math.ceil(total / items_per_page);
    //     const nextPage = page + 1 > lastPage ? null : page + 1;
    //     const prevPage = page - 1 < 1 ? null : page - 1;

    //     return {
    //         data: res,
    //         total,
    //         currenPage:page,
    //         nextPage,
    //         prevPage,
    //         lastPage
    //     }

    // }


    async findOne(id:number):Promise<Category>{
        return await this.categoryRepository.findOneBy({id});
    }

    async create(createCategoryDto:CreateCategoryDto):Promise<Category>{
        return await this.categoryRepository.save(createCategoryDto);
    }
    async update(id:number,updateCategoryDto:UpdateCategoryDto):Promise<UpdateResult>{
        return await this.categoryRepository.update(id,updateCategoryDto);
    }

    async delete(id:number):Promise<DeleteResult>{
        return await this.categoryRepository.delete(id);
    }

}

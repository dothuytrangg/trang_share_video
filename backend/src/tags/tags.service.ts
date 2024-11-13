import { response } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { common_response } from 'src/ultils/common';
import { FilterCategoryDto } from 'src/categories/dto/filter-category.dto';
import { FilterTagDto } from './dto/filter-tag.dto';
import { User } from 'src/users/entities/users.entity';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async findOne(id: number): Promise<Tag> {
        return await this.tagRepository.findOneBy({ id });
    }

    async createTag(createTagDto: CreateTagDto): Promise<Tag>{
        let response = common_response;

        try {
            createTagDto.status = 'active';
            let tag = await this.tagRepository.save(createTagDto);
          
            if(tag){
                response.tag = tag
                return response;
            } else{
                response.success = false;
            }     
            return response;       
        } catch (error) {
            response.success = false;
            response.message = error;    
            return response;        
        }
    }

    async findAll(query: FilterTagDto): Promise<any> {
        let response = common_response;
        const items_per_page = Number(query.items_per_page) || 10; // Default to 10 if not specified
        const page = Number(query.page) || 1;  // Default to page 1 if not specified
        const skip = (page - 1) * items_per_page; // Skip based on page number
        const keyword = query.search || ''; // Default to empty string if no search term

        try {
            const [res, total] = await this.tagRepository.findAndCount({
                where: [
                    { name: Like(`%${keyword}%`) },
                    { slug: Like(`%${keyword}%`) },
                ],
                order: { created_at: 'DESC' },
                take: items_per_page,
                skip: skip,
                select: ['id', 'name', 'slug','created_at', 'status'],
            });

            // Tính toán các trang phân trang
            const lastPage = Math.ceil(total / items_per_page);
            const nextPage = page + 1 > lastPage ? null : page + 1;
            const prevPage = page - 1 < 1 ? null : page - 1;

          
            response.success = true;
            response.data = res;
            response.page = page;
            response.lastPage = lastPage;
            response.nextPage = nextPage;
            response.prevPage = prevPage;
            response.total = total;

            return response;

        } catch (error) {
            
            response.success = false;
            response.message = `An error occurred: ${error.message}`;
            return response;
        }
    }
    async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<UpdateResult>{
        let response = common_response;
            let updateTag = await this.tagRepository.update(id, updateTagDto);
            if(updateTag){
                response.tag = updateTag;
                return response;
            } else if (!updateTagDto.name){
                response.success = false;
                response.message = 'Tag is required';
            }else{
                response.success = false
            }
            return response;
        }

    async delete(id: number): Promise<DeleteResult> {
        let response = common_response;
        let tag = await this.tagRepository.delete(id);
        if (tag) {
            response.success = true;
            return response;
        } else {
            response.success = false;

        }
        return response;
        // return await this.categoryRepository.delete(id);
    }



}

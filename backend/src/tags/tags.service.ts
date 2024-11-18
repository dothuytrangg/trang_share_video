import { response } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { common_response } from 'src/ultils/common';
import { FilterCategoryDto } from 'src/categories/dto/filter-category.dto';
import { FilterTagDto } from './dto/filter-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { formatDate, formatEntityDates } from 'src/ultils/date-hepler';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async findOne(id: number): Promise<any> {
        const tag = await this.tagRepository.findOneBy({ id });

        // Nếu tìm thấy tag, format ngày tháng, nếu không thì trả về null
        return tag ? formatEntityDates(tag) : null;
    }

    async createTag(createTagDto: CreateTagDto, userId: number): Promise<any> {
        let response = { ...common_response };

        try {
            // Kiểm tra user_id
            if (isNaN(userId) || userId === undefined) {
                throw new Error("Invalid User ID");
            }

            createTagDto.user_id = userId;
            createTagDto.status = 'active';
            console.log(createTagDto.user_id);  // Kiểm tra giá trị user_id


            const tag = await this.tagRepository.save(createTagDto);

            if (tag) {
                response.success = true;
                response.tag = formatEntityDates(tag);
            } else {
                response.success = false;
                response.message = 'Failed to create tag';
            }
            return response;
        } catch (error) {
            response.success = false;
            response.message = `An error occurred: ${error.message}`;
            return response;
        }
    }


async findAll(query: FilterTagDto): Promise < any > {
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
            select: ['id', 'name', 'slug', 'created_at', 'status'],
        });

        // Định dạng ngày tháng cho tất cả các tag trong kết quả
        const formattedRes = res.map((tag) => formatEntityDates(tag));

        // Tính toán các trang phân trang
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        response.success = true;
        response.data = formattedRes; // Sử dụng dữ liệu đã được định dạng
        response.page = page;
        response.lastPage = lastPage;
        response.nextPage = nextPage;
        response.prevPage = prevPage;
        response.total = total;

        return response;

    } catch(error) {
        response.success = false;
        response.message = `An error occurred: ${error.message}`;
        return response;
    }
}

    async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<UpdateResult>{
        let response = common_response;
            let updateTag = await this.tagRepository.update(id, updateTagDto); 
            if(updateTag){
                response.tag = formatEntityDates(updateTag);
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
    async findAllTags(): Promise<Tag[]> {
        const queryBuilder = this.tagRepository.createQueryBuilder('tags');
        const tags = await queryBuilder.getMany();
        console.log('Query Result:', tags);  // Log kết quả từ QueryBuilder
        return tags;
    }


    
}

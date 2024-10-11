// import { common } from '@mui/material/colors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { FilterCategoryDto } from 'src/categories/dto/filter-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { Category } from 'src/categories/entities/categories.entity';
import { common_response } from 'src/ultils/common';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // async findAll(): Promise<Category[]> {
  //   let response = common_response;
  //   let catgegories = await this.categoryRepository.find({
  //     select: ['id', 'name', 'description', 'created_at'],
  //   });
  //   if(catgegories.length > 0){
  //     // console.log(catgegories.length)
  //     response.data = catgegories;
  //     response.success = true;
  //     return response;
  //   }

  //   return response;
  // }
  async findAll(query:FilterCategoryDto):Promise<any>{
    let response = common_response;
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1)* items_per_page;
    const keyword = query.search || '';
    const [res, total] = await this.categoryRepository.findAndCount({
        where:[
            {name: Like('%' + keyword + '%')}
           

        ],
        order: {created_at:"DESC"},
        take:items_per_page,
        skip:skip,
        select: ['id', 'name', 'description', 'created_at'],

    })
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    if([res, total]){
      response.success = true;
      response.data = res;
      response.page = page;
      response.lastPage = lastPage;
      response.nextPage = nextPage;
      response.prevPage = prevPage;
      response.total = total;
      return response;
    }else{
      response.success = false;
    }

    return response;

}


  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    let response = common_response;
    try {
      
      let category = await this.categoryRepository.save(createCategoryDto);
      if (category) {
        response.category = category
        return response;
      } else  {
        response.success = false;
      }

      return response;
    } catch (error) {
      response.success = false;
      response.message = error;
      return response;
    }
  }
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    let response = common_response;
  
    let updateCategory =  await this.categoryRepository.update(id, updateCategoryDto);
    if(updateCategory){
      response.success = true;
      return response;
    }else if(!UpdateCategoryDto.name){
      response.message = 'Name is required';
      response.success = false;

    }else{
      response.success = false;
    }
  
    return response;
  }

  async delete(id: number): Promise<DeleteResult> {
    let response = common_response;
    let categories =  await this.categoryRepository.delete(id);
    if(categories){
       response.success = true;
       return response;
    }else{
      response.success = false;
      
    }
    return response;
    // return await this.categoryRepository.delete(id);
  }
}

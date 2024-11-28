// import { common } from '@mui/material/colors';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { FilterCategoryDto } from 'src/categories/dto/filter-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { Category } from 'src/categories/entities/categories.entity';
import { common_response } from 'src/ultils/common';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { DeleteResult, Like, QueryFailedError, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(VideoDetail)
    private videoDetailRepository: Repository<VideoDetail>
  ) {}

  async findAlls(): Promise<Category[]> {
    let response = common_response;
    let catgegories = await this.categoryRepository.find({
      select: ['id', 'name', 'description', 'created_at'],
    });
    if(catgegories.length > 0){
      // console.log(catgegories.length)
      response.data = catgegories;
      response.success = true;
      return response;
    }

    return response;
  }
  async findAll(query:FilterCategoryDto):Promise<any>{
    let response = common_response;
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1)* items_per_page;
    const keyword = query.search || '';
    const pinnedCategory = await this.categoryRepository.findOne({
      where: { status: 2 },
      select: ['id', 'name', 'description', 'slug', 'status', 'created_at'],
    });
    const [res, total] = await this.categoryRepository.findAndCount({
        where:[
            {name: Like('%' + keyword + '%')}
           

        ],
        order: {created_at:"DESC"},
        take:items_per_page,
        skip:skip,
        select: ['id', 'name', 'description','slug','status', 'created_at'],

    })
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    let ok = [res, total]
    if(ok){
      response.success = true;
      response.pinnedCategory = pinnedCategory
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
    let response = common_response;
    let category = await this.categoryRepository.findOneBy({ id });
    if(category){
      response.data = category;
      response.success=true
      return response;
    }else{
      response.success = false
    }
    return response;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    

    let response = common_response;
    try {
      

      const category = await this.categoryRepository.save(createCategoryDto);
      if(category){
        response.success = true
        response.category = category
  

      }else{
        response.success = false
      }
      

  
      // Trả về thành công
      return response;
    }catch (error) {
      
      console.error('Error:', error); 
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') { 
          response.success = false;
          response.message = `Category with name  ${createCategoryDto.name} already exists.`
          response.statusCode =400
          return response;
          // throw new BadRequestException(`Category with name  ${createCategoryDto.name} already exists.`);
          
        }
      }
      response.success = false;
      response.message = "An unexpected error occurred."
      response.statusCode=500
     
      // throw new InternalServerErrorException("An unexpected error occurred.");
      
    }
    return response;
    
  }
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    let response = common_response;
    try {
     
  
    let updateCategory =  await this.categoryRepository.update(id, updateCategoryDto);
    if(updateCategory.affected==1){
      response.success = true;
      response.message = "ok";
      return response;
    }else{
      response.success = false;
    }
    return response;
      
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') { 
          response.success = false;
          response.message = `Category with name  ${updateCategoryDto.name} already exists.`
          response.statusCode =400
          return response;
          // throw new BadRequestException(`Category with name  ${createCategoryDto.name} already exists.`);
          
        }
      }
      response.success = false;
      response.message = "An unexpected error occurred."
      response.statusCode=500

      
    }
  
    return response;
  }

  async delete(id: number): Promise<DeleteResult> {
    let response = common_response;
    try {
        await this.videoDetailRepository.delete({ category: { id } });
        let categories =  await this.categoryRepository.delete(id);
        if(categories){
          response.success = true;
          return response;
        }else{
          response.success = false;
          
        }
    return response;
    } catch (error) {
      response.success = false;
      response.message = error.message || 'An error occurred while deleting the category';
      return response;
    }
    // return await this.categoryRepository.delete(id);
  }
}

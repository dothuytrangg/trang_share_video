import {IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";




export class CreateCategoryDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(50, {
        message: 'name is too long',
    })
    name: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(300, {
        message: 'name is too long',
    })
    description: string;
    

    slug: string;
  
    status: number;

}

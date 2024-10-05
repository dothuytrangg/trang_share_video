import {IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";




export class UpdateCategoryDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(30, {
        message: 'name is too long',
    })
    name: string;
    
    @IsString()
    description: string;
    

    slug: string;
  

}

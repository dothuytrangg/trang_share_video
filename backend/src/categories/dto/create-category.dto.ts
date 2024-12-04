import {IsEmail,  IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";




export class CreateCategoryDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(30, {
        message: 'name is too long',
    })
    @Matches(/^[a-zA-Z]+$/, {
        message: 'Category name must contain only alphabetic characters.',
    })
    name: string;
    


    description: string;
    

    slug: string;
  
    status: number;

}

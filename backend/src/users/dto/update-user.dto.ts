import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(50, {
        message: 'name is too long',
    })
    @Matches(/^[a-zA-Z]+$/, {
        message: 'Category name must contain only alphabetic characters.',
    })
    full_name: string;
    @IsNotEmpty()
    password: string;
    
   

}
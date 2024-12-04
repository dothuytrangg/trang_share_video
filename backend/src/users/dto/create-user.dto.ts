import {IsEmail,  IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";




export class CreateUserDto{
 
 
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
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password is too short',
      })
    @MaxLength(16, {
        message: 'Password is too long',
    })
    password: string;
    
    status: number;

}
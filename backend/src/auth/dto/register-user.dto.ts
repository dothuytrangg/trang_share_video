import {IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";




export class RegisterUserDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(50, {
        message: 'name is too long',
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
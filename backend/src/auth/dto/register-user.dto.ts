import {IsEmail,  IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";




export class RegisterUserDto{
 
 
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
      message: 'Full name must only contain letters and spaces.',
    })
    @MinLength(3, {
        message: 'full_name is too short',
      })
    @MaxLength(50, {
        message: 'full_name is too long',
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
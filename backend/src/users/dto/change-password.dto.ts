import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class ChangePasswordDto{
 
 
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password is too short',
    })
    @MaxLength(16, {
        message: 'Password is too long',
    })

     password: string;

     @IsNotEmpty()
     @MinLength(6, {
         message: 'Password is too short',
     })
     @MaxLength(16, {
         message: 'Password is too long',
     })
     confirm_password: string;
    

}
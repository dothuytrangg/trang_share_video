import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto{
 
 
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(50, {
        message: 'name is too long',
    })
    full_name: string;
    
   

}
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class ChangePasswordDto{
 
 
    @IsNotEmpty()
    password: string;
    

}
import { IsEmail, IsEmpty } from "class-validator";

export class LoginUserDto {
    @IsEmpty()
    @IsEmail()
    email: string;
    @IsEmpty()
    password: string;
}
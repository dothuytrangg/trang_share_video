import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ForgotPasswordDto {
   @IsNotEmpty()
   @IsEmail({}, { message: "Please enter a valid email address." })
   email: string;
}
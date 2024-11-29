import { IsNotEmpty, MinLength, MaxLength, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    resetToken: string;
    @MinLength(6, {
        message: 'Password is too short',
    })
    @MaxLength(16, {
        message: 'Password is too long',
    })
    @IsNotEmpty()
    newPassword: string;


    @MinLength(6, {
        message: 'Password is too short',
    })
    @MaxLength(16, {
        message: 'Password is too long',
    })
    @IsNotEmpty()
    //  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    newConfirmPassword: string;
}
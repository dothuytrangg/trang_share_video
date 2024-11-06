import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResendOtpDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
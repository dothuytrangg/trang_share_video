import { IsNotEmpty } from "class-validator";


export class VerifyDto{
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    token: string;
}
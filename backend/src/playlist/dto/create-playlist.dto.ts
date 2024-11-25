import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePlaylistDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
    })
    @MaxLength(30, {
        message: 'name is too long',
    })
    name: string;
    video_id: number;
    user_id: number;
    status: string;
    
}
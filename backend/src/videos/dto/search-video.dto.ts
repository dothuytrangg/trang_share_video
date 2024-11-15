// search-video.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class SearchVideoDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    url?: string;
}

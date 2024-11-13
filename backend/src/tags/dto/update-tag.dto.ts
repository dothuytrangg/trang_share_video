import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Column } from "typeorm";

export class UpdateTagDto {


    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'name is too short',
    })
    @MaxLength(30, {
        message: 'name is too long',
    })
    name: string;

    @IsString()
    slug: string;

    @Column({ default: 'inactive' })
    status: 'active' | 'inactive';


}

import { Transform } from "class-transformer";
import {ArrayNotEmpty, IsArray, IsEmail,  IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Column, ManyToOne } from "typeorm";




export class CreateVideoDto{
 
 

  
    @Column({})
    name: string;
  
    
    @Column({nullable:true, default: null})
    description: string;
    
    @Column({nullable:true, default: null})
    timeout: number;
  
  
    @Column({nullable:true, default: null})
    url: string;
  
    
    @Column({nullable:false, default: 0})
    likes: number;
  
  
    @Column({nullable:false, default:0 })
    dislike: number;
  
    @Column({nullable:false, default:0 })
    viewed: number;
    
    @Column({ nullable:true,default:null })
    slug: string;
  
    @Column({ default:10 })
    position: number;
  
    @Column({ default:false })
    is_hot: boolean;
  
    @Column({ nullable:true,default:null })
    thumbnail: string;
    

    
    @Column({default:'confirming'  })
    status: string;

    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray({ message: "categories must be an array" })
    @ArrayNotEmpty({ message: "categories should not be empty" })
    @IsOptional() // Cho phép không gửi
  categories: number[];
  
    // @ManyToOne(() => User, (user: User) => user.videos)
    // user: User;


}
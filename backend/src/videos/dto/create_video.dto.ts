import {ArrayNotEmpty, IsArray, IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
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
  
    
    @Column({nullable:true, default: null})
    likes: number;
  
  
    @Column({nullable:true, default:null })
    dislike: number;
  
    @Column({nullable:true, default:null })
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

    @IsArray()
    @ArrayNotEmpty()
    categories: number[];
  
    // @ManyToOne(() => User, (user: User) => user.videos)
    // user: User;


}
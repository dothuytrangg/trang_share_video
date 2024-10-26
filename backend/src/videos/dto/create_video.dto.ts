import {IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Column, ManyToOne } from "typeorm";




export class CreateVideoDto{
 
 

  
    @Column()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'name is too short',
      })
    @MaxLength(30, {
        message: 'name is too long',
    })
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
    

    
    @Column({ default:1 })
    status: number;
  
    // @ManyToOne(() => User, (user: User) => user.videos)
    // user: User;


}
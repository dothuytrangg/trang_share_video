import {IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Column, ManyToOne } from "typeorm";




export class UpdateVideoDto{
 
 

  
    @Column({})
    name: string;
  
    
    @Column({nullable:true, default: null})
    description: string;
    
  
    @Column({ nullable:true,default:null })
    thumbnail: string;
    



}
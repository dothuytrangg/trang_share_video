

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/categories/entities/categories.entity';
import { User } from 'src/users/entities/users.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class VideoDetail {
  @PrimaryGeneratedColumn()
  id: number;



  @ManyToOne(() => Video, (video:any) => video.videoDetails)
  video: Video

  @ManyToOne(() => User, (user:any) => user.videoDetails)
  user: User
  
  

  // @OneToOne(() => User)
  // @JoinColumn()s
  // user: User

  @ManyToOne(() => Category, (category:any) => category.videoDetails)
  category: Category
  
//   @Column({default:null,nullable:true  })
//   status: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
  
}
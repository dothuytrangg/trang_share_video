

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/users.entity';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({default:null,nullable:true})
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Video, (video:any) => video.histories)
  video: Video

  @ManyToOne(() => User, (user:any) => user.histories)
  user: User
  
  
}
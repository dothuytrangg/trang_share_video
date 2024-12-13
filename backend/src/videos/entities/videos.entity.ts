

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { History } from 'src/histories/entities/histories.entity';
import { LikePlaylist } from 'src/playlist-like/entities/likeplaylist.entity';
import { User } from 'src/users/entities/users.entity';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
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
  
  @ManyToOne(() => User, (user:any) => user.photos)
  user: User
  
  @Column({default:'confirming',nullable:false})
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(() =>VideoDetail, (videoDetail) => videoDetail.video)
  videoDetail: VideoDetail[]
    likePlaylists: any;
  
}
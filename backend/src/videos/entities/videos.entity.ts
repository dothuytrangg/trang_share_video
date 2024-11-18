

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { TagDetail } from 'src/tags-detail/entities/tagsdetail.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';

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
  
  @ManyToOne(() => User, (user:any) => user.photos)
  user: User
  
  @Column({default:'confirming'  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
  // @OneToMany(() => TagDetail, tagDetail => tagDetail.video)
  // tagDetails: TagDetail[]; // Ánh xạ đến nhiều TagDetail
  
}
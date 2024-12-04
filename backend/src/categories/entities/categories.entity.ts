

import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import moment from 'moment-timezone';
import { VideoDetail } from 'src/video-details/entities/video-details.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, UpdateDateColumn, BeforeInsert, BeforeUpdate, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(3, {
    message: 'Category name must be at least 3 characters long.',
  })
  @IsNotEmpty({ message: "Category name isn't empty."})
  @MaxLength(30, {
    message: 'Category name must be less than 30 characters.',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Category name must contain only alphabetic characters.',
  })
  name: string;


  @Column({nullable:true, default: null})
  description: string;
  
    
  @Column({nullable:true, default: null})
  slug: string;

  @Column({ default:1 })
  status: number;

  @CreateDateColumn({ })
  created_at: Date;

  @UpdateDateColumn({ })
  updated_at: Date;

  @OneToMany(() =>VideoDetail, (videoDetail) => videoDetail.category)
  videoDetail: VideoDetail[]


  
}
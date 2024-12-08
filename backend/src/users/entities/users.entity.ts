

import { IsEmail, IsNotEmpty } from 'class-validator';
import { History } from 'src/histories/entities/histories.entity';
import { Video } from 'src/videos/entities/videos.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;


  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @Column()
  password: string;

  @Column({default:1})
  role:number


  @Column({nullable:true, default: null})
  refresh_token: string;

  
  @Column({nullable:true, default: null})
  avatar: string;


  @Column({ default:1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Column({nullable: true})
  emailVerifiedAt: Date;

  @Column({ default: 'inactive' })
  statusVerify: 'active' | 'inactive';
  
  @OneToMany(() => Video, (video) => video.user)
    videos: Video[]

    @OneToMany(() => History, history => history.user)
    histories: History[];

  
}
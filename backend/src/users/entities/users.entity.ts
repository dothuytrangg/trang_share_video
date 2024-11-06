

import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
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

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  lastOtpSent: Date;




  
}
import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Column, ManyToOne, CreateDateColumn, JoinColumn, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' }) // Liên kết với cột userId
  user: User;


  @Column()
  @IsNotEmpty()
  token: string;

  @Column()
  @IsNotEmpty()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

}

    
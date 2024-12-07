import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User,
{ onDelete: 'CASCADE' }) // Thêm onDelete
  @JoinColumn({ name: 'userId' }) // Liên kết với cột userId trong bảng User
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

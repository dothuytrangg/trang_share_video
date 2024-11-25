import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('histories')
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    video_id: number;

    @Column()
    user_id: number;

    @Column({ default: 'in-progress' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

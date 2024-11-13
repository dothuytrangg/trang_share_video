import { Tag } from 'src/tags/entities/tags.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tagDetails')
export class TagDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    video_id: number;

    @Column()
    tag_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'varchar', length: 20 })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Tag, (tag) => tag.tagDetails)
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}

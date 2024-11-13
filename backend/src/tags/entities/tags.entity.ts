import { IsOptional } from 'class-validator';
import { TagDetail } from 'src/tags-detail/entities/tagsdetail.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @IsOptional()
    user_id: number;

    @Column({ default: 'inactive' })
    status: 'active' | 'inactive';

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToMany(() => TagDetail, (tagDetail) => tagDetail.tag)
    tagDetails: TagDetail[];
}

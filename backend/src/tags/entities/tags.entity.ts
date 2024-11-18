import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { TagDetail } from 'src/tags-detail/entities/tagsdetail.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'int', nullable: true })
    user_id: number;

    @Column({ default: 'inactive' })
    status: 'active' | 'inactive';

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // @OneToMany(() => TagDetail, (tagDetail) => tagDetail.tag)
    // tagDetails: TagDetail[];

}

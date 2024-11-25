import { Video } from 'src/videos/entities/videos.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    video_id: number;

    @Column()
    user_id: number;

    @Column()
    status: string;

    @CreateDateColumn({ })
    created_at: Date;

    @UpdateDateColumn({ })
    updated_at: Date;

    @OneToMany(() => Video, (video) => video.playlist, { cascade: true })
    video: Video[];
}

import { User } from "src/users/entities/users.entity";
import { Video } from "src/videos/entities/videos.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LikePlaylist{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    status: 'like' | 'dislike';
    @CreateDateColumn()
    create_at: Date;
    @CreateDateColumn()
    updated_at:Date;


    @ManyToOne(() => User, (user) => user.likePlaylists)
    user: User;

    @ManyToOne(() => Video, (video) => video.likePlaylists)
    video: Video;


}
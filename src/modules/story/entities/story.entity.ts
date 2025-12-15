import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("stories")
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text" })
  mediaUrl: string; // image yoki video

  @Column({
    type: "enum",
    enum: ["image", "video"],
    default: "image",
  })
  mediaType: "image" | "video";

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date;
}

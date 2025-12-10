import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Story } from "./story.entity";

@Entity("story_views")
export class StoryView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storyId: number;

  @ManyToOne(() => Story, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storyId" })
  story: Story;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  viewedAt: Date;
}

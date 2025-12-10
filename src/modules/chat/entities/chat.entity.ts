import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromUserId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fromUserId" })
  fromUser: User;

  @Column()
  toUserId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "toUserId" })
  toUser: User;

  @Column({ type: "text" })
  text: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

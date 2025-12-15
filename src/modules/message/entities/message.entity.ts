import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Chat } from "../../chat/entities/chat.entity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: "CASCADE" })
  @JoinColumn()
  chat: Chat;

  @Column()
  senderId: number;

  @Column({ type: "text" })
  text: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: "timestamp", nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

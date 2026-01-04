import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, { nullable: false })
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (msg) => msg.chat)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}

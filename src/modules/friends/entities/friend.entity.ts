import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('friends')
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.friends, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.friendOf, {
    onDelete: 'CASCADE',
  })
  friend: User;

  @Column()
  friendId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

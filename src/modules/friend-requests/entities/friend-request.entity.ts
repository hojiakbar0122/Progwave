import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type FriendRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  fromUser: User;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  toUser: User;

  @Column()
  toUserId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status: FriendRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

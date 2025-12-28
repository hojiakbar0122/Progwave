import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Position } from 'src/modules/position/entity/position.entity';
import { FriendRequest } from 'src/modules/friend-requests/entities/friend-request.entity';
import { Friend } from 'src/modules/friends/entities/friend.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Media } from 'src/modules/media/entity/media.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerify: boolean;

  public async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @ManyToOne(() => Position, (position) => position.users)
  @JoinColumn()
  position: Position;

  @OneToMany(() => FriendRequest, (req) => req.fromUser)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (req) => req.toUser)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.friend)
  friendOf: Friend[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @ManyToOne(() => Media, (media) => media.users, { onDelete: 'SET NULL' })
  avatar: Media;
}

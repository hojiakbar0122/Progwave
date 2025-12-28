import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  website: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImageUrl: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'date', nullable: true })
  birthday: Date;
}

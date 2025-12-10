import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("friends")
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friends, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.friendOf, {
    onDelete: "CASCADE",
  })
  friend: User;

  @Column()
  friendId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

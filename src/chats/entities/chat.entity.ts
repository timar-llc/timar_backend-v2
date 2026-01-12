import { Offer } from 'src/offers/entities/offer.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../messages/entities/message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'chats')
  @JoinColumn({ name: 'user1_uuid' })
  user1: User;

  @ManyToOne('User', 'chats')
  @JoinColumn({ name: 'user2_uuid' })
  user2: User;

  @OneToMany('Message', 'chat')
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

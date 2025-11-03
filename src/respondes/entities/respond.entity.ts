import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Order } from 'src/orders/entities/order.entity';
import { Message } from 'src/chats/messages/entities/message.entity';

@Entity('respondes')
export class Respond {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('Task', 'respondes')
  @JoinColumn({ name: 'task_uuid' })
  task: Task;

  @ManyToOne('User', 'respondes')
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @OneToOne('Order', 'respond', { nullable: true })
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true, name: 'cover_letter', type: 'text' })
  coverLetter: string;

  @OneToMany('Message', 'respond')
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

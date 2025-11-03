import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import type { Respond } from 'src/respondes/entities/respond.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'orders')
  @JoinColumn({ name: 'client_uuid' })
  client: User;

  @ManyToOne('User', 'completedOrders')
  @JoinColumn({ name: 'freelancer_uuid' })
  freelancer: User;

  @OneToOne('Respond', 'order', { nullable: true })
  @JoinColumn({ name: 'respond_uuid' })
  respond: Respond;

  @ManyToOne('Task', 'orders')
  @JoinColumn({ name: 'task_uuid' })
  task: Task;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true, default: 'pending' })
  status: 'pending' | 'active' | 'completed' | 'cancelled';

  @OneToMany('Review', 'order')
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

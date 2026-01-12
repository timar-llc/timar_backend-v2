import { IsEnum } from 'class-validator';
import { Category } from 'src/common/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Respond } from 'src/respondes/entities/respond.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskFile } from './taskFile.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PaginationEntity } from 'src/common/entities/pagination.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard'],
  })
  complexity: 'easy' | 'medium' | 'hard';

  @ManyToOne('Category', 'tasks', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_uuid' })
  category: Category;

  @ManyToOne('User', 'tasks', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @OneToMany('Respond', 'task', { onDelete: 'CASCADE' })
  respondes: Respond[];

  @OneToMany('Order', 'task', { onDelete: 'CASCADE' })
  orders: Order[];

  @OneToMany('TaskFile', 'task', { onDelete: 'CASCADE' })
  files: TaskFile[];

  @OneToMany('Chat', 'task', { onDelete: 'CASCADE' })
  chats: Chat[];

  @Column({ default: false, name: 'is_draft' })
  isDraft: boolean;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  currency: string;

  @Column({ default: 0 })
  views: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'ended_at' })
  endedAt: Date;

  // Virtual field for respondes count (not stored in DB)
  respondesCount?: number;
}

export class TaskWithPagination extends PaginationEntity {
  @ApiProperty({ type: [Task] })
  tasks: Task[];
}

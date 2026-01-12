import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @ManyToOne('User', 'notifications', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @IsEnum(['info', 'success', 'warning', 'error'])
  icon: 'info' | 'success' | 'warning' | 'error';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'readed_at' })
  readedAt: Date;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata: Record<string, any>;
}

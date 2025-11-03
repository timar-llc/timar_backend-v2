import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity({ name: 'task_files' })
export class TaskFile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne('Task', 'files', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_uuid' })
  task: Task;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio', 'file'] })
  @IsEnum(['image', 'video', 'audio', 'file'])
  type: 'image' | 'video' | 'audio' | 'file';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

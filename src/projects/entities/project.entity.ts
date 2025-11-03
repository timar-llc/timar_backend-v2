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
import { Category } from '../../common/entities/category.entity';
import type { ProjectMedia } from './projectMedia.entity';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne('Category', 'projects', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'category_uuid' })
  category: Category;

  @ManyToOne('User', 'projects', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ default: false, name: 'is_draft' })
  isDraft: boolean;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true })
  currency: string;

  @OneToMany('ProjectMedia', 'project', { onDelete: 'CASCADE', nullable: true })
  media: ProjectMedia[];

  @Column({ nullable: true })
  technologies: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  @IsEnum(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

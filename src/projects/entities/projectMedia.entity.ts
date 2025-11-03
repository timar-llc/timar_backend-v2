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
import { Project } from './project.entity';

@Entity({ name: 'project_media' })
export class ProjectMedia {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  url: string;


  @ManyToOne('Project', 'media', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_uuid' })
  project: Project;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio'] })
  @IsEnum(['image', 'video', 'audio'])
  type: 'image' | 'video' | 'audio';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

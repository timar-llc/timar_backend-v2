import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { Column } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  slug: string;

  @ManyToOne('Category', 'subcategories', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_uuid' })
  parent?: Category | null;

  @OneToMany('Category', 'parent', { onDelete: 'CASCADE' })
  subcategories: Category[];

  @OneToMany('Project', 'category', { onDelete: 'CASCADE' })
  projects: Project[];

  @OneToMany('Task', 'category', { onDelete: 'CASCADE' })
  tasks: Task[];
}

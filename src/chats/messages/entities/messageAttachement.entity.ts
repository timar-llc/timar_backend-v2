import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { IsEnum } from 'class-validator';

@Entity({ name: 'message_attachements' })
export class MessageAttachement {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  url: string;

  @ManyToOne('Message', 'attachments')
  @JoinColumn({ name: 'message_uuid' })
  message: Message;

  @Column({ type: 'enum', enum: ['image', 'video', 'audio', 'file'] })
  @IsEnum(['image', 'video', 'audio', 'file'])
  type: 'image' | 'video' | 'audio' | 'file';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { MessageAttachement } from './messageAttachement.entity';
import { Respond } from 'src/respondes/entities/respond.entity';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('Chat', 'messages', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_uuid' })
  chat: Chat;

  @ManyToOne('User', 'messages')
  @JoinColumn({ name: 'sender_uuid' })
  sender: User;

  @ManyToOne('Message', 'replies', { nullable: true })
  @JoinColumn({ name: 'reply_to_uuid' })
  replyTo: Message;

  @ManyToOne('Respond', 'messages', { nullable: true })
  @JoinColumn({ name: 'respond_uuid' })
  respond: Respond;

  @Column({ nullable: true })
  content: string;

  @OneToMany('MessageAttachement', 'message', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  attachments: MessageAttachement[];

  @Column({
    nullable: true,
    name: 'message_type',
    type: 'enum',
    enum: ['text', 'audio', 'offer'],
  })
  @ApiProperty({ enum: ['text', 'audio', 'offer'] })
  type: 'text' | 'audio' | 'offer';

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  audioDuration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'readed_at' })
  readedAt: Date;

  @Column({ nullable: true, name: 'delivered_at' })
  deliveredAt: Date;
}

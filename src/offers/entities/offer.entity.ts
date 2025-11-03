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
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'comingOffers')
  @JoinColumn({ name: 'client_uuid' })
  client: User;

  @ManyToOne('User', 'incomingOffers')
  @JoinColumn({ name: 'freelancer_uuid' })
  freelancer: User;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  status: 'pending' | 'approved' | 'rejected';

  @OneToMany('Chat', 'offer', { onDelete: 'CASCADE' })
  chats: Chat[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amountWithCommission: number;

  @Column({ enum: ['card', 'crypto', 'sbp'], name: 'payment_method' })
  paymentMethod: string;

  @ManyToOne('User', 'transactions')
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['deposit', 'withdrawal', 'achievement'],
  })
  type: 'deposit' | 'withdrawal' | 'achievement';

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed', 'processing'],
  })
  status: 'pending' | 'completed' | 'failed' | 'processing';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'processed_at' })
  processedAt: Date;

  @Column({ nullable: true, name: 'failed_at' })
  failedAt: Date;

  @Column({ nullable: true, name: 'completed_at' })
  completedAt: Date;
}

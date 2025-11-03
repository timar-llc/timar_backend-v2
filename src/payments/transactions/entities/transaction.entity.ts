import { PaymentMethod } from 'src/payments/payment-methods/entities/paymentMethod.entity';
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

  @Column()
  amount: number;

  @Column({ nullable: true, name: 'currency' })
  currency: string;

  @Column({ nullable: true, name: 'crypto_amount' })
  cryptoAmount: number;

  @Column({ nullable: true, name: 'crypto_currency' })
  cryptoCurrency: string;

  @Column({ nullable: true, name: 'exchange_rate' })
  exchangeRate: number;

  @ManyToOne('PaymentMethod', 'transactions')
  @JoinColumn({ name: 'payment_method_uuid' })
  paymentMethod: PaymentMethod;

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

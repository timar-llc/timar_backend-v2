import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaymentMethod } from 'src/payments/payment-methods/entities/paymentMethod.entity';

@Entity('payout_requests')
export class PayoutRequest {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'payoutRequests')
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: 'pending' | 'approved' | 'rejected' | 'processing';

  @ManyToOne('PaymentMethod', 'payoutRequests')
  @JoinColumn({ name: 'payment_method_uuid' })
  paymentMethod: PaymentMethod;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

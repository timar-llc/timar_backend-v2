import { Transaction } from 'src/payments/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
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
import { PayoutRequest } from 'src/payments/payout-requests/entities/payoutRequest.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'paymentMethods')
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @OneToMany('Transaction', 'paymentMethod')
  transactions: Transaction[];

  @OneToMany('PayoutRequest', 'paymentMethod')
  payoutRequests: PayoutRequest[];

  @Column({
    type: 'enum',
    enum: ['card', 'crypto'],
  })
  type: 'card' | 'crypto';

  @Column({ default: false, name: 'is_default' })
  isDefault: boolean;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'card_brand' })
  cardBrand: string;

  @Column({ nullable: true, name: 'card_number' })
  cardNumber: string;

  @Column({ nullable: true, name: 'card_holder_name' })
  cardHolderName: string;

  @Column({ nullable: true, name: 'card_expiry_date' })
  cardExpiryDate: string;

  @Column({ nullable: true, name: 'card_cvv' })
  cardCvv: string;

  @Column({ nullable: true, name: 'crypto_currency' })
  cryptoCurrency: string;

  @Column({ nullable: true, name: 'crypto_network' })
  cryptoNetwork: string;

  @Column({ nullable: true, name: 'crypto_address' })
  cryptoAddress: string;

  @Column({ nullable: true, name: 'crypto_qr_code_url' })
  cryptoQrCodeUrl: string;

  @Column({ nullable: true, name: 'bank_name' })
  bankName: string;

  @Column({ nullable: true, name: 'account_number' })
  accountNumber: string;

  @Column({ nullable: true, name: 'routing_number' })
  routingNumber: string;

  @Column({ nullable: true, name: 'swift_code' })
  swiftCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

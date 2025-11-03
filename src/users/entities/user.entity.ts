import {
  IsBoolean,
  IsEmail,
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDecimal,
} from 'class-validator';
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
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Respond } from 'src/respondes/entities/respond.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Country } from 'src/common/entities/country.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Transaction } from 'src/payments/transactions/entities/transaction.entity';
import { Message } from 'src/chats/messages/entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { PaymentMethod } from 'src/payments/payment-methods/entities/paymentMethod.entity';
import { PayoutRequest } from 'src/payments/payout-requests/entities/payoutRequest.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @OneToMany('Project', 'user')
  projects: Project[];

  @OneToMany('Task', 'user')
  tasks: Task[];

  @OneToMany('Respond', 'user')
  respondes: Respond[];

  @OneToMany('Order', 'client')
  orders: Order[];

  @ManyToOne('Country', 'users')
  @JoinColumn({ name: 'country_uuid' })
  country: Country;

  @OneToMany('Order', 'freelancer')
  completedOrders: Order[];

  @OneToMany('Offer', 'client')
  incomingOffers: Offer[];

  @OneToMany('Review', 'target')
  reviewsAsFreelancer: Review[];

  @OneToMany('Review', 'reviewer')
  reviewsAsClient: Review[];

  @OneToMany('Offer', 'freelancer')
  comingOffers: Offer[];

  @OneToMany('Message', 'sender')
  messages: Message[];

  @OneToMany('Transaction', 'user')
  transactions: Transaction[];

  @OneToMany('Chat', 'user1')
  chats: Chat[];

  @OneToMany('PaymentMethod', 'user')
  paymentMethods: PaymentMethod[];

  @OneToMany('PayoutRequest', 'user')
  payoutRequests: PayoutRequest[];

  @Column({ unique: true, nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Column({ name: 'password_hash' })
  @IsString()
  @IsOptional()
  passwordHash: string;

  @Column({ name: 'is_online', default: true })
  @IsBoolean()
  @IsOptional()
  isOnline: boolean;

  @Column({ name: 'first_name', nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Column({ name: 'username', nullable: true })
  @IsString()
  @IsOptional()
  username: string;

  @Column({ name: 'avatar_url', nullable: true })
  @IsString()
  @IsOptional()
  avatarUrl: string;

  @Column({ name: 'specialization', nullable: true })
  @IsString()
  @IsOptional()
  specialization: string;

  @Column({ name: 'cv', nullable: true })
  @IsString()
  @IsOptional()
  cv: string;

  @Column({ name: 'profile_completeness', nullable: true, default: 0 })
  @IsNumber()
  @IsOptional()
  profileCompleteness: number;

  @Column({
    name: 'rating',
    nullable: true,
    default: 5.0,
    type: 'decimal',
    precision: 2,
    scale: 1,
  })
  @IsDecimal()
  @IsOptional()
  rating: number;

  @Column({ name: 'phone_number', nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @Column({ name: 'verification_code', nullable: true })
  @IsString()
  verificationCode: string;

  @Column({ name: 'email_confirmed', default: false })
  emailConfirmed: boolean;

  @Column({ name: 'telegram_id', nullable: true })
  telegramId: string;

  @Column({ name: 'github_id', nullable: true })
  githubId: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_online_at', nullable: true })
  lastOnlineAt: Date;

}

import {
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  text: string;

  @ManyToOne('User', 'reviewsAsFreelancer')
  @JoinColumn({ name: 'target_uuid' })
  target: User;

  @ManyToOne('User', 'reviewsAsClient')
  @JoinColumn({ name: 'reviewer_uuid' })
  reviewer: User;

  @ManyToOne('Order', 'reviews')
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'enum', enum: ['client', 'freelancer'], name: 'target_type' })
  targetType: 'client' | 'freelancer';

  @Column()
  rating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

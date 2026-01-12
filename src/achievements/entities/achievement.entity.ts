import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @ManyToOne('User', 'achievements', { onDelete: 'CASCADE' })
  user: User;

  @Column()
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({
    type: 'enum',
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  })
  @IsEnum(['common', 'rare', 'epic', 'legendary'])
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @Column({ nullable: true, name: 'received_at' })
  receivedAt: Date;
}

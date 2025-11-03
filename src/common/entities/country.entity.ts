import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column()
  slug: string;

  @OneToMany('User', 'country')
  users: User[];
}

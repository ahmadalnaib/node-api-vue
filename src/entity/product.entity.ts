import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  category: string;

  @Column()
  image: string;

  @Column('json')
  rating: {
    rate: number;
    count: number;
  };

  @Column({ default: true })
  can_buy: boolean;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => User, user => user.products)
  user: User;
}
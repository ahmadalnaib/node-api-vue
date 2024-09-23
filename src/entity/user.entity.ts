import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  confirm_password: string;

  @OneToMany(() => Product, product => product.user)
  products: Product[];

  // createdAt: Date;
  // updatedAt: Date;
  // deletedAt: Date;
}
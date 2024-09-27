import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne,JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Role } from './role.entity';
import { Joi } from 'express-validation';

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

  @ManyToOne(() => Role)
  role:Role;

  @OneToMany(() => Product, product => product.user)
  @JoinColumn({name:"role_id"})
  products: Product[];

  // createdAt: Date;
  // updatedAt: Date;
  // deletedAt: Date;
}
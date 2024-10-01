import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class About {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  photo: string;

  @Column()
  color: string; 
}
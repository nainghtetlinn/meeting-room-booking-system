import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  user!: User;
}

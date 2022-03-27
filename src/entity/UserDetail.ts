import {
  PrimaryGeneratedColumn, Entity, Column, OneToOne, JoinColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class UserDetail {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => User, (userId) => userId.userDetail)
  @JoinColumn()
    userId: User;

  @Column()
    fullname: string;

  @Column()
    address: string;

  @Column({
    unique: true,
  })
    matriculationNumber: string;

  @Column({
    unique: true,
  })
    mail: string;
}

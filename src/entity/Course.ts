import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Course {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    unique: true,
  })
    name: string;

  @OneToMany(() => User, (user: User) => user.course, {
    nullable: true,
    cascade: true,
  })
    students: User[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import Module from './Module';
import User from './User';

@Entity()
export default class Grades {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => Module)
    moduleId: Module;

  @OneToOne(() => User)
    studentId: User;

  @Column()
    grade: number;

  @Column()
    weight: number;
}

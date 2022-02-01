import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Module from './Module';
import User from './User';

@Entity()
export default class Grades {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => Module)
  @JoinColumn()
    moduleId: Module;

  @OneToOne(() => User)
  @JoinColumn()
    studentId: User;

  @Column()
    grade: number;

  @Column()
    weight: number;
}

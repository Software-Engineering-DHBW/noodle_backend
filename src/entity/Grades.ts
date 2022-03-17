import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Module from './Module';
import User from './User';

@Entity()
export default class Grades {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Module, {
    nullable: false,
  })
  @JoinColumn()
    moduleId: Module;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
    studentId: User;

  @Column()
    grade: number;

  @Column()
    weight: number;
}

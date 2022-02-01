import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import Course from './Course';
import Module from './Module';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    unique: true,
  })
    username: string;

  @Column()
    password: string;

  @Column({
    default: false,
  })
    isTeacher: boolean;

  @Column({
    default: false,
  })
    isAdministrator: boolean;

  @ManyToOne(() => Module, (module: Module) => module.id)
    is_teacher: Module;

  @ManyToOne(() => Course, (course: Course) => course.id)
    course: Course;
}

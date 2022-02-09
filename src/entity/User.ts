import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,
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

  @ManyToMany(() => Module, (module: Module) => module.id)
    teacherOfModule: Module[];

  @ManyToOne(() => Course, (course: Course) => course.id)
    course: Course;
}

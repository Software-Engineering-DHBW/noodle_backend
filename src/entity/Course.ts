import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import Module from './Module';
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

  @OneToMany(() => Module, (module: Module) => module.assignedCourse, {
    nullable: true,
  })
    assignedModules: Module[];
}

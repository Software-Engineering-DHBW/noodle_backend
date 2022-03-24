import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import Course from './Course';
import User from './User';

@Entity()
export default class Module {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @Column({
    nullable: true,
  })
    description: string;

  @ManyToMany(() => User, {
    cascade: true,
  })
  @JoinTable()
    assignedTeacher: User[];

  @ManyToOne(() => Course, (course: Course) => course.assignedModules, {
    nullable: true,
  })
  @JoinColumn()
    assignedCourse: Course;

  @OneToMany(() => Module, (module: Module) => module.seniormodule, {
    cascade: true,
    nullable: true,
  })
    submodule: Module[];

  @ManyToOne(() => Module, (module: Module) => module.id)
    seniormodule: Module;
}

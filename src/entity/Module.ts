import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn,
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

  @OneToMany(() => User, (user: User) => user.id)
    assignedTeacher: User[];

  @OneToOne(() => Course, {
    nullable: true,
  })
  @JoinColumn()
    assignedCourse: Course;

  @OneToMany(() => Module, (module: Module) => module.id)
    submodule: Module[];

  @ManyToOne(() => Module, (module: Module) => module.id)
    seniormodule: Module;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Entity()
export class Module {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @OneToOne(() => User)
    @JoinColumn()
    assignedTeacher: User;

    @OneToOne(() => Course)
    @JoinColumn()
    assignedCourse: Course;

    @OneToMany(() => Module, module => module.id)
    submodule: Module[];

    @ManyToOne(() => Module, module => module.id)
    seniormodule: Module;
}

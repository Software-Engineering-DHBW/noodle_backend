import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Entity()
export class Module {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @OneToOne(() => User)
    assigned_teacher: User;

    @OneToOne(() => Course)
    assigned_course: Course;

    @OneToMany(() => Module, module => module.id)
    submodule: Module;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Entity()
export class Module {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @OneToOne(() => User)
    @JoinColumn()
    assigned_teacher: User;

    @OneToOne(() => Course)
    @JoinColumn()
    assigned_course: Course;

    @OneToMany(() => Module, module => module.id)
    submodule: Module[];

    @ManyToOne(() => Module, module => module.id)
    seniormodule: Module;
}

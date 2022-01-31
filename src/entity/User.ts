import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "./Course";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  password: string;

  @Column({
    default: false
  })
  is_teacher: boolean;

  @Column({
    default: false
  })
  is_administrator: boolean;

  @ManyToOne(() => Course, course => course.id)
  course: Course;
}

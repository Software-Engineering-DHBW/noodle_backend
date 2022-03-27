import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn,
} from 'typeorm';
import Course from './Course';
import UserDetail from './UserDetail';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => UserDetail, (userDetail) => userDetail.userId)
  @JoinColumn()
    userDetail: UserDetail;

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

  @ManyToOne(() => Course, (course: Course) => course.id)
    course: Course;
}

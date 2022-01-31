import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

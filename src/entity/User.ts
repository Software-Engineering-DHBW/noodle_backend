import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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
}

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    owner: User;

    @Column()
    name: string;

    @Column()
    path: string;

    @Column()
    upload_date: Date;
}

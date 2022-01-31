import {PrimaryGeneratedColumn, Entity, Column, OneToOne, JoinColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserDetail {

  @PrimaryGeneratedColumn()
  id: number; 

  @OneToOne(() => User)
  @JoinColumn()
  userId: User;

  @Column()
  fullname: string;

  @Column()
  address: string;

  @Column({
    unique: true
  })
  matriculationNumber: string;

  @Column({
    unique: true
  })
  mail: string;

}

import {PrimaryGeneratedColumn, Entity, Column, OneToOne, JoinColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserDetail {

  @PrimaryGeneratedColumn()
  id: number; 

  @OneToOne(() => User)
  @JoinColumn()
  user_id: User;

  @Column()
  fullname: string;

  @Column()
  address: string;

  @Column({
    unique: true
  })
  matriculation_number: string;

  @Column({
    unique: true
  })
  mail: string;

}

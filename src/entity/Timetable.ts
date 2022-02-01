import {
  PrimaryGeneratedColumn, Entity, Column, OneToOne, JoinColumn,
} from 'typeorm';
import Module from './Module';

@Entity()
export default class Timetable {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    startTime: Date;

  @Column()
    endTime: Date;

  @OneToOne(() => Module)
  @JoinColumn()
    assignedModule: Module;

  @Column()
    description: string;

  @Column()
    rooms: string;
}

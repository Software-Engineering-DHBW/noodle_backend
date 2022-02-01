import {
  PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn,
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

  @ManyToOne(() => Module)
  @JoinColumn()
    assignedModule: Module;

  @Column()
    description: string;

  @Column()
    room: string;
}

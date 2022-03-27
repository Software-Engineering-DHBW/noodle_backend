import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import ModuleItem from './ModuleItem';
import User from './User';

@Entity()
export default class File {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => User)
  @JoinColumn()
    owner: User;

  @Column()
    name: string;

  @Column()
    path: string;

  @Column()
    uploadDate: Date;

  @ManyToOne(() => ModuleItem, (moduleItem: ModuleItem) => moduleItem.id, {
    onDelete: 'CASCADE',
    cascade: true,
  })
    attachedAt: ModuleItem;

  @Column({
    default: false,
  })
    isLectureMaterial: boolean;

  @Column({
    default: false,
  })
    isExercise: boolean;
}

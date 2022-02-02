import {
  Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import ModuleItem from './ModuleItem';
import User from './User';

@Entity()
export default class File {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => User)
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
  })
    uploadedAt: ModuleItem;
}

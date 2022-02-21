import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Module from './Module';
import File from './File';

@Entity()
export default class ModuleItem {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Module, (module: Module) => module.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
    moduleId: Module;

  @Column({
    nullable: true,
  })
    content: string;

  @Column({
    nullable: true,
  })
    webLink: string;

  @Column({
    default: false,
  })
    hasDownloadableFile: boolean;

  @Column({
    default: false,
  })
    hasFileUpload: boolean;

  @OneToMany(() => File, (file: File) => file.attachedAt, {
    nullable: true,
    cascade: true,
  })
    attachedFiles: File[];

  @Column({
    default: false,
  })
    isVisible: boolean;

  @Column({
    nullable: true,
  })
    dueDate: Date;
}

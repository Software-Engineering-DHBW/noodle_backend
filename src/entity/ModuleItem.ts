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

  @OneToOne(() => File, {
    nullable: true,
  })
  @JoinColumn()
  downloadableFile: File;

  @Column({
    default: false,
  })
  hasFileUpload: boolean;

  @OneToMany(() => File, (file: File) => file.uploadedAt, {
    nullable: true,
    cascade: true,
  })
  uploadedFiles: File[];

  @Column({
    default: false,
  })
  isVisible: boolean;
}

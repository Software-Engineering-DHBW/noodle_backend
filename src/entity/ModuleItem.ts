import {
  Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Module from './Module';
import File from './File';

@Entity()
export default class ModuleItem {
  @PrimaryGeneratedColumn()
    id: number;

  @OneToOne(() => Module, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
    ModuleId: Module;

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

  @OneToMany(() => File, (file: File) => file.id, {
    nullable: true,
  })
    uploadedFiles: File[];

  @Column({
    default: false,
  })
    isVisible: boolean;
}

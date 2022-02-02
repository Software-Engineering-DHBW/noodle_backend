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

  @Column()
    content: string;

  @Column()
    webLink: string;

  @OneToOne(() => File)
  @JoinColumn()
    downloadableFile: File;

  @Column()
    hasFileUpload: boolean;

  @OneToMany(() => File, (file: File) => file.id)
    uploadedFiles: File[];

  @Column()
    isVisible: boolean;
}

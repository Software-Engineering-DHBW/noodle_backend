import Module = require("module");
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./File";

@Entity()
export class ModuleItem {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Module)
    @JoinColumn()
    Module_id: Module;

    @Column()
    content: string;

    @Column()
    web_link: string;

    @OneToOne(() => File)
    downloadable_file: File;

    @Column()
    has_file_upload: boolean;

    @OneToMany(() => File, file => file.id)
    uploaded_files: File;

    @Column()
    is_visible: boolean;
}

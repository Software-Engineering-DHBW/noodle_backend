import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModuleItem } from "./ModuleItem";
import { User } from "./User";

@Entity()
export class File {

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

    @ManyToOne(() => ModuleItem, module_item => module_item.id)
    uploadedAt: ModuleItem;
}

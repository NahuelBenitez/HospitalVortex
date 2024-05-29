import { BaseEntity } from "src/config/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Enfermedades extends BaseEntity {
    @Column()
    nombre: string;
}

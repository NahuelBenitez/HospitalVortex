
import { BaseEntity } from "src/config/base.entity";
import { Entrada } from "src/entradas/entities/entrada.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Medico extends BaseEntity {

    @Column()
    licenseNumber: number;

    @Column()
    name: string;  

    @Column()
    lastName: string;

    @Column()
    entryDate: Date;
    @OneToMany(() => Entrada, entrada => entrada.medico)
    entradas: Entrada[]; // Agregamos la propiedad 'entradas'
}

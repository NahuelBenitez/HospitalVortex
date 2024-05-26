import { BaseEntity } from "src/config/base.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from "typeorm";
import { HistoriaClinica } from "src/historia-clinica/entities/historia-clinica.entity";

@Entity()
export class Paciente extends BaseEntity {
    @Column()
    dni: number;

    @Column()
    name: string;  

    @Column()
    lastName: string;

    @Column()
    birthdayDate: Date;

    @Column()
    medicalInsurance: string;

    @OneToOne(() => HistoriaClinica, historiaClinica => historiaClinica.paciente, {
        cascade: true,
      })
    historiaClinica: HistoriaClinica;
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date; // Columna para el soft delete
}

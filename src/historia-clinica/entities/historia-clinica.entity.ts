import { BaseEntity } from "src/config/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Paciente } from "../../pacientes/entities/paciente.entity"; // Ajustar la ruta de importación según la estructura de tu proyecto
import { Entrada } from "src/entradas/entities/entrada.entity";

@Entity()
export class HistoriaClinica extends BaseEntity {
    @OneToOne(() => Paciente, paciente => paciente.historiaClinica)
    @JoinColumn({ name: 'pacienteId' })        
    paciente: Paciente;

    
  @OneToMany(() => Entrada, entrada => entrada.historiaClinica)
  entradas: Entrada[]; // Agregamos la propiedad 'entradas'
}

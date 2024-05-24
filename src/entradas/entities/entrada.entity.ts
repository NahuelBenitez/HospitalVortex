import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/config/base.entity';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';
import { Medico } from 'src/medicos/entities/medico.entity';

export enum TipoEntrada {
  Consulta = 'consulta',
  Practica = 'practica',
}

@Entity()
export class Entrada extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoEntrada })
  tipo: TipoEntrada;

  @Column({ nullable: true })
  motivoConsulta: string;

  @Column({ nullable: true })
  diagnostico: string;

  @Column({ nullable: true })
  confirmadoDiagnostico: boolean;

  @Column({ nullable: true })
  duracionProcedimiento: number;

  @Column({ nullable: true })
  complicaciones: string;

  @Column({ nullable: true })
  resultadoFinal: string;

  @ManyToOne(() => HistoriaClinica, historiaClinica => historiaClinica.entradas)
  historiaClinica: HistoriaClinica;

  @ManyToOne(() => Medico, medico => medico.entradas)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;
}

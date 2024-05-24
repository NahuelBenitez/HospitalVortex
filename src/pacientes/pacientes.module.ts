import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, HistoriaClinica])],
  controllers: [PacientesController],
  providers: [PacientesService],
})
export class PacientesModule {}

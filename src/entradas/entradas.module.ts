import { Module } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { EntradasController } from './entradas.controller';
import { Entrada } from './entities/entrada.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';
import { Medico } from 'src/medicos/entities/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrada, HistoriaClinica, Medico])],
  controllers: [EntradasController],
  providers: [EntradasService],
})
export class EntradasModule {}

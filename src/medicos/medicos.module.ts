import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { Medico } from './entities/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}

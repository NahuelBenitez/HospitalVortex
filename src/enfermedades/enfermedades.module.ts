import { Module } from '@nestjs/common';
import { EnfermedadesService } from './enfermedades.service';
import { EnfermedadesController } from './enfermedades.controller';
import { Enfermedades } from './entities/enfermedade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Enfermedades])],
  controllers: [EnfermedadesController],
  providers: [EnfermedadesService],
})
export class EnfermedadesModule {}

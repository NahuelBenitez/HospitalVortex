import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriaClinicaService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository: Repository<HistoriaClinica>,
  ) {}

  create(createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return 'This action adds a new historiaClinica';
  }

  async findAll(): Promise<HistoriaClinica[]> {
    try {
      const medicalHistories: HistoriaClinica[] = await this.historiaClinicaRepository.find({
        relations: ['paciente', 'entradas', 'entradas.medico', 'entradas.enfermedadDiagnostico'],
      });
      if (medicalHistories.length === 0) {
        throw new HttpException('No medical histories found', HttpStatus.NOT_FOUND);
      }
      return medicalHistories;
    } catch (error) {
      throw new HttpException('Failed to fetch medical histories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  findOne(id: number) {
    return `This action returns a #${id} historiaClinica`;
  }

  update(id: number, updateHistoriaClinicaDto: UpdateHistoriaClinicaDto) {
    return `This action updates a #${id} historiaClinica`;
  }

  remove(id: number) {
    return `This action removes a #${id} historiaClinica`;
  }
}

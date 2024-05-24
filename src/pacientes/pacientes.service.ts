import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';

@Injectable()
export class PacientesService {
  constructor (
    @InjectRepository(Paciente)
    private readonly pacienteRepository : Repository<Paciente>,
    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository : Repository<HistoriaClinica>,
  ){}
  async create(body: CreatePacienteDto): Promise<Paciente> {
    try {
      const paciente : Paciente = this.pacienteRepository.create({
        ...body,
        historiaClinica: {}
      });
      const savedPaciente = await this.pacienteRepository.save(paciente);
      if(!savedPaciente){
        throw new Error('No se encontro paciente')
      }
      return savedPaciente
    } catch (error) {
      throw new Error(`Error al crear paciente: ${error.message}`);

    }
  }

  async findAll(): Promise<Paciente[]> {
    try {
      const pacientes : Paciente[] = await this.pacienteRepository.find({relations:['historiaClinica']});
      if (pacientes.length === 0) {
        throw new Error('No se encontraron pacientes');
      }
      return pacientes;
    } catch (error) {
      throw new Error(`Error al buscar pacientes: ${error.message}`);

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} paciente`;
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return `This action updates a #${id} paciente`;
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}

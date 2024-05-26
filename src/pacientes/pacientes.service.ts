import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Repository, UpdateResult } from 'typeorm';
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
  async  findOne(id: number) {
    try {
     const patient: Paciente = await this.pacienteRepository.findOne( { 
       where:{id},
       relations: ['medicalHistory'] });
     if(!patient){
       throw new Error('No se encontró el paciente con el ID proporcionado');
     }
     return patient;
    } catch (error) {
     throw new Error(`Error al buscar pacientes: ${error.message}`);
    }
   }
 
   async update(id: number, body: UpdatePacienteDto): Promise<UpdateResult> {
     try {
       const updateResult: UpdateResult = await this.pacienteRepository.update(id, body);
       if (updateResult.affected === 0) {
         throw new Error('No se pudo actualizar el paciente con el ID proporcionado');
       }
       return updateResult;
     } catch (error) {
       throw new Error(`Error al actualizar paciente: ${error.message}`);
     }
   }

   async remove(id: number): Promise<void> {
    try {
      const paciente = await this.pacienteRepository.findOne({where:{id}});
      if (!paciente) {
        throw new Error(`No se encontró el paciente con id ${id}`);
      }
      paciente.deletedAt = new Date();
      await this.pacienteRepository.save(paciente);
    } catch (error) {
      throw new Error(`Error al eliminar el paciente: ${error.message}`);
    }
  }
}

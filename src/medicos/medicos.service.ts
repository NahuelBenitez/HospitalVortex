import { Injectable } from '@nestjs/common';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(body: CreateMedicoDto): Promise<Medico> {
    try {
      const medico: Medico = await this.medicoRepository.save(body);
      if (!medico) {
        throw new Error('No se encontro doctor');
      }
      return medico;
    } catch (error) {
      throw new Error('No se pudo crear el Doctor');
    }
  }

  async findAll() {
    try {
      const doctors: Medico[] = await this.medicoRepository.find();
      // Validar si se encontraron pacientes
      if (doctors.length === 0) {
        throw new Error('No se encontraron doctores');
      }
      return doctors;
    } catch (error) {
      // Capturar y relanzar el error
      throw new Error(`Error al buscar doctores: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const medico: Medico = await this.medicoRepository.findOne( { 
        where:{id}});
      if(!medico){
        throw new Error('No se encontró el doctor con el ID proporcionado');
      }
      return medico;
     } catch (error) {
      throw new Error(`Error al buscar doctor: ${error.message}`);
     }
  }

  async update(id: number, body: UpdateMedicoDto): Promise<UpdateResult> {
    try {
      const updateResult: UpdateResult = await this.medicoRepository.update(id, body);
      if (updateResult.affected === 0) {
        throw new Error('No se pudo actualizar el doctor con el ID proporcionado');
      }
      return updateResult;
    } catch (error) {
      throw new Error(`Error al actualizar doctor: ${error.message}`);
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      const deleteResult: DeleteResult = await this.medicoRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new Error('No se pudo borrar el doctor con el ID proporcionado');
      }
      return deleteResult;
    } catch (error) {
      throw new Error(`Error al eliminar doctor: ${error.message}`);
    }
  }
}

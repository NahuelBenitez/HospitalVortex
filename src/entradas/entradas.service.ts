import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrada, TipoEntrada } from './entities/entrada.entity';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';
import { Medico } from 'src/medicos/entities/medico.entity';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';

@Injectable()
export class EntradasService {
  constructor(
    @InjectRepository(Entrada)
    private readonly entradaRepository: Repository<Entrada>,
    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository: Repository<HistoriaClinica>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>
  ) {}

  async create(body: CreateEntradaDto): Promise<Entrada> {
    const { medicalHistoryId, doctorId, ...entradaData } = body;

    // Obtener la historia clínica y el médico según los IDs proporcionados
    const medicalHistory = await this.historiaClinicaRepository.findOne({ where: { id: medicalHistoryId } });
    const doctor = await this.medicoRepository.findOne({ where: { id: doctorId } });

    // Verificar si se encontraron la historia clínica y el médico
    if (!medicalHistory || !doctor) {
      throw new HttpException('Medical history or doctor not found', HttpStatus.NOT_FOUND);
    }

    // Crear una nueva instancia de Entrada con los datos proporcionados
    const newEntrada = new Entrada();
    Object.assign(newEntrada, entradaData);
    newEntrada.historiaClinica = medicalHistory;
    newEntrada.medico = doctor;

    try {
      // Guardar la nueva entrada médica en la base de datos
      return await this.entradaRepository.save(newEntrada);
    } catch (error) {
      throw new HttpException('Failed to create medical entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll(): Promise<Entrada[]> {
    return this.entradaRepository.find();
  }

  findOne(id: number): Promise<Entrada> {
    return this.entradaRepository.findOne({ where: { id } });
  }
  async findAllConsultas(): Promise<Partial<Entrada>[]> {
    return this.entradaRepository.find({
      where: { tipo: TipoEntrada.Consulta}, // Filtrar por el tipo de entrada 'consulta'
      select: ['id', 'tipo', 'motivoConsulta', 'diagnostico', 'confirmadoDiagnostico'],
    });
  }

  async update(id: number, updateMedicalEntryDto: UpdateEntradaDto): Promise<Entrada> {
    const medicalEntry = await this.entradaRepository.findOne({where:{id}});

    if (!medicalEntry) {
      throw new HttpException('Medical entry not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Merge y guardar los cambios en la entrada médica
      this.entradaRepository.merge(medicalEntry, updateMedicalEntryDto);
      return await this.entradaRepository.save(medicalEntry);
    } catch (error) {
      throw new HttpException('Failed to update medical entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    const medicalEntry = await this.entradaRepository.findOne({where:{id}});

    if (!medicalEntry) {
      throw new HttpException('Medical entry not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Eliminar la entrada médica de la base de datos
      await this.entradaRepository.remove(medicalEntry);
    } catch (error) {
      throw new HttpException('Failed to remove medical entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

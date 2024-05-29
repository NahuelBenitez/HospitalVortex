import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrada, TipoEntrada } from './entities/entrada.entity';
import { HistoriaClinica } from 'src/historia-clinica/entities/historia-clinica.entity';
import { Medico } from 'src/medicos/entities/medico.entity';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';


// Interfaz para definir la estructura exacta de los objetos de salida
export interface EntradaDTO {
  id: number;
  tipo: TipoEntrada;
  motivoConsulta: string | null;
  diagnostico: string | null;
  confirmadoDiagnostico: boolean | null;
  duracionProcedimiento: number | null;
  complicaciones: string | null;
  resultadoFinal: string | null;
  medico: { id: number; nombre: string; apellido: string } | null;
  paciente: { id: number; nombre: string; apellido: string } | null;
  fecha: Date;
}
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

  // async findAll(): Promise<Entrada[]> {
  //   try {
  //     const entradas : Entrada[] = await this.entradaRepository.find({relations:['enfermedadDiagnostico']});
  //     if (entradas.length === 0) {
  //       throw new Error('No se encontraron entradas');
  //     }
  //     return entradas;
  //   } catch (error) {
  //     throw new Error(`Error al buscar entradas: ${error.message}`);

  //   }
  // }

  async findAll(): Promise<EntradaDTO[]> {
    try {
      const entradas: Partial<Entrada>[] = await this.entradaRepository.find({
        relations: ['enfermedadDiagnostico', 'medico', 'historiaClinica', 'historiaClinica.paciente'],
      });

      // Filtrar las entradas que están asociadas a historias clínicas de pacientes no borrados lógicamente
      const entradasFiltradas = entradas.filter(entrada => entrada.historiaClinica.paciente !== null);

      if (entradasFiltradas.length === 0) {
        throw new Error('No se encontraron entradas válidas');
      }

      // Mapear las entradas para ajustar el formato de respuesta
      return entradasFiltradas.map(entrada => ({
        id: entrada.id,
        tipo: entrada.tipo,
        motivoConsulta: entrada.motivoConsulta,
        diagnostico: entrada.diagnostico,
        confirmadoDiagnostico: entrada.confirmadoDiagnostico,
        duracionProcedimiento: entrada.duracionProcedimiento,
        complicaciones: entrada.complicaciones,
        resultadoFinal: entrada.resultadoFinal,
        medico: entrada.medico ? { id: entrada.medico.id, nombre: entrada.medico.name, apellido: entrada.medico.lastName } : null,
        paciente: entrada.historiaClinica.paciente ? { id: entrada.historiaClinica.paciente.id, nombre: entrada.historiaClinica.paciente.name, apellido: entrada.historiaClinica.paciente.lastName } : null,
        fecha: entrada.createdAt, // Asumiendo que la fecha de creación se almacena en 'createdAt'
      }));
    } catch (error) {
      throw new Error(`Error al buscar entradas: ${error.message}`);
    }
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
   async findAllPracticas(): Promise<Partial<Entrada>[]> {
    return this.entradaRepository.find({
      where: { tipo: TipoEntrada.Practica}, // Filtrar por el tipo de entrada 'consulta'
      select: ['id', 'tipo', 'duracionProcedimiento', 'complicaciones', 'resultadoFinal'],
    });
  }
  // Service
async findAllByDateRange(from: Date, to: Date): Promise<Entrada[]> {
  // Ajustar las fechas para que incluyan todo el rango de ese día
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00.000
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999); // Establecer la hora a 23:59:59.999 del mismo día
  toDate.setDate(toDate.getDate() + 1); // Agregar un día para incluir el día 'to'

  // Construir la consulta con TypeORM
  const queryBuilder = this.entradaRepository.createQueryBuilder('entrada')
    .leftJoinAndSelect('entrada.enfermedadDiagnostico', 'enfermedad')
    .where('entrada.createdAt >= :from AND entrada.createdAt < :to', { from: fromDate, to: toDate });

  // Ejecutar la consulta y devolver el resultado
  return queryBuilder.getMany();
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

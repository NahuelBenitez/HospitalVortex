// create-entrada.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { TipoEntrada } from '../entities/entrada.entity';

export class CreateEntradaDto {
    medicalHistoryId: number;
    doctorId: number;
  @IsEnum(TipoEntrada)
  @IsNotEmpty()
  tipo: TipoEntrada;

  @IsOptional()
  @IsString()
  motivoConsulta?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsBoolean()
  confirmadoDiagnostico?: boolean;

  @IsOptional()
  @IsNumber()
  duracionProcedimiento?: number;

  @IsOptional()
  @IsString()
  complicaciones?: string;

  @IsOptional()
  @IsString()
  resultadoFinal?: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { TipoEntrada } from './entities/entrada.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { EntradaDTO } from './entradas.service';


@Controller('entradas')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createEntradaDto: CreateEntradaDto) {
    return this.entradasService.create(createEntradaDto);
  }
  @UseGuards(AuthGuard)
  @Get('consulta')
  findAllConsultas() {
    return this.entradasService.findAllConsultas();
  }
  @UseGuards(AuthGuard)
  @Get('practica')
  findAllPracticas() {
    return this.entradasService.findAllPracticas();
  }
  @UseGuards(AuthGuard)
  @Get('fecha')
  async findAllByDateRange(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    // Convertir las cadenas de fecha en objetos Date
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Llamar al servicio con las fechas convertidas
    return this.entradasService.findAllByDateRange(fromDate, toDate);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<EntradaDTO[]> {
    return this.entradasService.findAll();
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradasService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntradaDto: UpdateEntradaDto) {
    return this.entradasService.update(+id, updateEntradaDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradasService.remove(+id);
  }
}

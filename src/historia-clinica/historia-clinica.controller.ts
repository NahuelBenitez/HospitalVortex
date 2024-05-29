import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HistoriaClinicaService } from './historia-clinica.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('historia-clinica')
export class HistoriaClinicaController {
  constructor(
    private readonly historiaClinicaService: HistoriaClinicaService,
  ) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return this.historiaClinicaService.create(createHistoriaClinicaDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.historiaClinicaService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('consulta')
  findAllConsultas() {
    // Llamar al servicio para obtener las historias clínicas con los campos especificados
    return this.historiaClinicaService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historiaClinicaService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoriaClinicaDto: UpdateHistoriaClinicaDto,
  ) {
    return this.historiaClinicaService.update(+id, updateHistoriaClinicaDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historiaClinicaService.remove(+id);
  }
}

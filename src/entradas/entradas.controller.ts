import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';

@Controller('entradas')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post()
  create(@Body() createEntradaDto: CreateEntradaDto) {
    return this.entradasService.create(createEntradaDto);
  }

  @Get()
  findAll() {
    return this.entradasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntradaDto: UpdateEntradaDto) {
    return this.entradasService.update(+id, updateEntradaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradasService.remove(+id);
  }
}

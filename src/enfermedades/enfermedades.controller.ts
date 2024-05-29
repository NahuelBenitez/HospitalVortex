import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnfermedadesService } from './enfermedades.service';
import { CreateEnfermedadeDto } from './dto/create-enfermedade.dto';
import { UpdateEnfermedadeDto } from './dto/update-enfermedade.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('enfermedades')
export class EnfermedadesController {
  constructor(private readonly enfermedadesService: EnfermedadesService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createEnfermedadeDto: CreateEnfermedadeDto) {
    return this.enfermedadesService.create(createEnfermedadeDto);
  }

  @Get()
  findAll() {
    return this.enfermedadesService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enfermedadesService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnfermedadeDto: UpdateEnfermedadeDto) {
    return this.enfermedadesService.update(+id, updateEnfermedadeDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enfermedadesService.remove(+id);
  }
}

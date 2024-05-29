import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnfermedadeDto } from './dto/create-enfermedade.dto';
import { UpdateEnfermedadeDto } from './dto/update-enfermedade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Enfermedades } from './entities/enfermedade.entity';

@Injectable()
export class EnfermedadesService {
  constructor(
    @InjectRepository(Enfermedades)
    private readonly enfermedadesRepository: Repository<Enfermedades>,
  ) {}

  public async create(body: CreateEnfermedadeDto): Promise<Enfermedades> {
    const newDisease = this.enfermedadesRepository.create(body);

    try {
      const savedDisease = await this.enfermedadesRepository.save(newDisease);

      if (!savedDisease) {
        throw new Error('Failed to find result');
      }

      return savedDisease;
    } catch (error) {
      throw new HttpException('Failed to create disease', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAll(text?: string): Promise<Enfermedades[]> {
    try {
      let queryOptions = {};

      if (text) {
        queryOptions = { where: { nombre: Like(`%${text}%`) } };
      }

      const diseases: Enfermedades[] = await this.enfermedadesRepository.find(queryOptions);

      if (!text && diseases.length === 0) {
        throw new HttpException('No diseases found', HttpStatus.NOT_FOUND);
      }
      
      return diseases;
    } catch (error) {
      throw new HttpException('Failed to find diseases', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOne(id: number): Promise<Enfermedades> {
    try {
      const disease: Enfermedades = await this.enfermedadesRepository.findOne({where:{id}});
      if (!disease) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return disease;
    } catch (error) {
      throw new HttpException('Failed to find disease', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(
    id: number,
    body: UpdateEnfermedadeDto,
  ): Promise<UpdateResult> {
    try {
      const disease: UpdateResult = await this.enfermedadesRepository.update(
        id,
        body,
      );
      if (disease.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return disease;
    } catch (error) {
      throw new HttpException('Failed to update disease', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async remove(id: number): Promise<DeleteResult> {
    try {
      const disease: DeleteResult = await this.enfermedadesRepository.delete(id);
      if (disease.affected === 0) {
        throw new HttpException('Failed to find result', HttpStatus.BAD_REQUEST);
      }
      return disease;
    } catch (error) {
      throw new HttpException('Failed to delete disease', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

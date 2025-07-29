import { Controller, Get, Post, Body, Param, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEstablishmentDto } from '../Application/dtos/create-establishment.dto';
import { PrismaEstablishmentRepository } from '../Infra/prisma/prisma-establishment.repository';
import { Establishment } from '../Domain/establishment/establishment.entity';
import { randomUUID } from 'crypto';

@Controller('establishments')
export class EstablishmentsController {
  constructor(
    private readonly establishmentRepository: PrismaEstablishmentRepository,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    try {
      const establishment = new Establishment(
        randomUUID(),
        createEstablishmentDto.name,
        createEstablishmentDto.cnpj,
        createEstablishmentDto.address,
      );

      // validate CNPJ
      if (!establishment.validarCNPJ()) {
        throw new HttpException('Invalid CNPJ format', HttpStatus.BAD_REQUEST);
      }

      return await this.establishmentRepository.create(establishment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to create establishment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllEstablishments(): Promise<Establishment[]> {
    try {
      return await this.establishmentRepository.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve establishments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getEstablishmentById(@Param('id') id: string): Promise<Establishment> {
    try {
      const establishment = await this.establishmentRepository.getEstablishmentById(id);
      if (!establishment) {
        throw new HttpException('Establishment not found', HttpStatus.NOT_FOUND);
      }
      return establishment;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to retrieve establishment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/documents')
  async getEstablishmentDocuments(@Param('id') id: string): Promise<any> {
    try {
      const establishment = await this.establishmentRepository.getEstablishmentById(id);
      if (!establishment) {
        throw new HttpException('Establishment not found', HttpStatus.NOT_FOUND);
      }

      // for now we will use placeholder instead of repo/service method
      return {
        establishment,
        message: 'Use /documents/establishment/' + id + ' to get documents'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to retrieve establishment documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

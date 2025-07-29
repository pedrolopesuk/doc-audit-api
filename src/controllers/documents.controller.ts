import { Controller, Get, Post, Body, Param, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDocumentUseCase } from '../Application/use-cases/create-doc/create.use-case';
import { CreateDocumentDto } from '../Application/dtos/create-document.dto';
import { PrismaDocumentRepository } from '../Infra/prisma/prisma-document.repository';
import { Document } from '../Domain/document/doc.entity';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly documentRepository: PrismaDocumentRepository,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createDocumentDto: CreateDocumentDto): Promise<Document> {
    try {
      const input = {
        ...createDocumentDto,
        issueDate: new Date(createDocumentDto.issueDate),
        expirationDate: new Date(createDocumentDto.expirationDate),
      };

      return await this.createDocumentUseCase.execute(input);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('establishment/:establishmentId')
  async getDocumentsByEstablishment(@Param('establishmentId') establishmentId: string): Promise<Document[]> {
    try {
      return await this.documentRepository.getEstablishmentById(establishmentId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string): Promise<Document> {
    try {
      const document = await this.documentRepository.findById(id);
      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }
      return document;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to retrieve document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllDocuments(): Promise<Document[]> {
    try {
      return await this.documentRepository.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

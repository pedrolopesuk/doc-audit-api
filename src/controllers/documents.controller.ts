import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Dependencies,
} from '@nestjs/common';
import { CreateDocumentUseCase } from '../Application/use-cases/create-doc/create.use-case';
import { CreateDocumentDto } from '../Application/dtos/create-document.dto';
import { PrismaDocumentRepository } from '../Infra/prisma/prisma-document.repository';
import { Document } from '../Domain/document/doc.entity';
import { toDocumentResponseDto } from '../Application/mappers/response-document.mapper';
import { DocumentResponseDto } from '../Application/dtos/response-document.dto';
import { FeeService } from '../Application/services/fee.service';
import { Dependency } from '../Domain/dependency/dependency.entity';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly documentRepository: PrismaDocumentRepository,
    private readonly feeService: FeeService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    try {

      // Gera um UUID se não vier no DTO
      const { v4: uuidv4 } = require('uuid');
      const input = {
        ...createDocumentDto,
        id: createDocumentDto.id && createDocumentDto.id !== '' ? createDocumentDto.id : uuidv4(),
        issueDate: new Date(createDocumentDto.issueDate),
        expirationDate: new Date(createDocumentDto.expirationDate),
      };

      const document = await this.createDocumentUseCase.execute(input);


      // Corrige o acesso ao id do documento
      const documentId = typeof document.getId === 'function' ? document.getId() : undefined;

      if (!documentId) {
        throw new HttpException('Falha ao obter o id do documento', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (input.dependencies?.length) {
        for (const dep of input.dependencies) {
          const dependency = new Dependency(
            documentId,
            dep.dependentDocumentId,
          );
          await this.documentRepository.addDependency(
            documentId,
            dependency.dependentDocumentId,
          );
        }
      }

      return document;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('establishment/:establishmentId')
  async getDocumentsByEstablishment(
    @Param('establishmentId') establishmentId: string,
  ): Promise<DocumentResponseDto[]> {
    try {
      const documents =
        await this.documentRepository.getEstablishmentById(establishmentId);

      documents.forEach((document) => {
        const fees = this.feeService.getFeesForDocument(document.getType());
        document.addDocumentFee(fees);
      });

      const documentsDto = documents.map((doc) => toDocumentResponseDto(doc));

      return documentsDto;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string): Promise<DocumentResponseDto> {
    try {
      const document = await this.documentRepository.findById(id);
      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      document.addDocumentFee(
        this.feeService.getFeesForDocument(document.getType()),
      );

      return toDocumentResponseDto(document);
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
  async getAllDocuments(): Promise<DocumentResponseDto[]> {
    try {
      const documents = await this.documentRepository.findAll();

      documents.forEach((document) => {
        const fees = this.feeService.getFeesForDocument(document.getType());
        document.addDocumentFee(fees);
      });

      const documentsDto = documents.map((doc) => toDocumentResponseDto(doc));

      return documentsDto;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

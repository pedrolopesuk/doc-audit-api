import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateDocumentUseCase } from '../Application/use-cases/create-doc/create.use-case';
import { CreateDocumentDto } from '../Application/dtos/create-document.dto';
import { PrismaDocumentRepository } from '../Infra/prisma/prisma-document.repository';
import { toDocumentResponseDto } from '../Application/mappers/response-document.mapper';
import { DocumentResponseDto } from '../Application/dtos/response-document.dto';
import { FeeService } from '../Application/services/fee.service';

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
  ): Promise<DocumentResponseDto> {
    try {
      // Apenas delega ao use case, que deve tratar UUID, datas, dependências, taxas, etc.
      // Garante que o id seja string
      const dtoWithId = {
        ...createDocumentDto,
        id: createDocumentDto.id ?? '',
      };
      // Executa o use case e converte para DTO de resposta
      const document = await this.createDocumentUseCase.execute(dtoWithId);
      // Converte para DocumentResponseDto se necessário
      return toDocumentResponseDto(document);
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

      this.feeService.attachFeesToDocuments(documents);

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

      this.feeService.attachFeesToDocuments([document]);

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

      this.feeService.attachFeesToDocuments(documents);

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

import { Body, Controller, Post } from '@nestjs/common';
import { CreateDocumentDto } from '../dtos/create-document.dot';
import { CreateDocumentUseCase } from '../../Application/use-cases/create-doc/create.use-case';

@Controller('documents') // /documents
export class DocumentController {
  constructor(private readonly createDocumentUseCase: CreateDocumentUseCase) {}

  @Post() // escuta POST /documents
  async create(@Body() body: CreateDocumentDto) {
    const document = await this.createDocumentUseCase.execute(body);

    return document; // responde com o documento criado
  }
}

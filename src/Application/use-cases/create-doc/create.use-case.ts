import { Injectable, Inject } from '@nestjs/common';
import { Document } from '../../../Domain/document/doc.entity';
import { Dependency } from '../../../Domain/dependency/dependency.entity';
import { IDocumentRepository } from '../../interfaces/document-repository.interface';
import { IEstablishmentRepository } from '../../interfaces/establishment-repository.interface';
import { CreateDocumentInput } from '../../interfaces/create-document.input';

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    @Inject('IDocumentRepository')
    private readonly documentRepository: IDocumentRepository,
    @Inject('IEstablishmentRepository')
    private readonly establishmentRepository: IEstablishmentRepository,
  ) {}

  async execute(input: CreateDocumentInput): Promise<Document> {
    const {
      name,
      type,
      description,
      issueDate,
      expirationDate,
      establishmentId,
    } = input;

    // Verificar se o estabelecimento existe
    const exists =
      await this.establishmentRepository.getEstablishmentById(establishmentId);
    if (!exists) {
      throw new Error('Estabelecimento não encontrado.');
    }

    const document = new Document(
      name,
      type,
      description ?? null,
      issueDate,
      expirationDate,
      establishmentId,
    );

    return await this.documentRepository.create(document);
  }
}

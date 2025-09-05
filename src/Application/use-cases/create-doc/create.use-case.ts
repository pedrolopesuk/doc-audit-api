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
      id,
      name,
      type,
      description,
      issueDate,
      expirationDate,
      establishmentId,
      dependencies,
    } = input;

    // Verificar se o estabelecimento existe
    const exists =
      await this.establishmentRepository.getEstablishmentById(establishmentId);
    if (!exists) {
      throw new Error('Estabelecimento não encontrado.');
    }

    const document = new Document(
      id,
      name,
      type,
      description ?? null,
      issueDate,
      expirationDate,
      establishmentId,
    );

    const createdDocument = await this.documentRepository.create(document);

    // Cria dependências se existirem
    if (dependencies?.length) {
      for (const dep of dependencies) {
        const dependency = new Dependency(
          createdDocument.getId(),
          dep.dependentDocumentId,
        );
        await this.documentRepository.addDependency(
          dependency.documentId,
          dependency.dependentDocumentId,
        );
      }
    }

    return createdDocument;
  }
}

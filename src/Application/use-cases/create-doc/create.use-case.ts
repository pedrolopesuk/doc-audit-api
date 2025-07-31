import { Injectable, Inject } from '@nestjs/common';
import { Document } from '../../../Domain/document/doc.entity';
import { Dependency } from '../../../Domain/dependency/dependency.entity';
import { IDocumentRepository } from '../../interfaces/document-repository.interface';
import { IEstablishmentRepository } from '../../interfaces/establishment-repository.interface';
import { CreateDocumentInput } from '../../interfaces/create-document.input';
import { randomUUID } from 'crypto';
import { DocumentFee } from 'src/Domain/document/docfee.entity';

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
      dependencies,
    } = input;

    // Verificar se o estabelecimento existe
    const exists =
      await this.establishmentRepository.getEstablishmentById(establishmentId);
    if (!exists) {
      throw new Error('Estabelecimento não encontrado.');
    }

    // Criar instância de documento (sem ID ainda)
    const document = new Document(
      name,
      type,
      description ?? null,
      issueDate,
      expirationDate,
      establishmentId,
      dependencies?.map((dep) => new Dependency('', dep.dependentDocumentId)) ||
        [],
    );

    // Persistir e obter o ID gerado
    const created = await this.documentRepository.create(document);
    const documentId = created.getId();

    // Dependências
    if (dependencies?.length) {
      for (const dep of dependencies) {
        const dependency = new Dependency(documentId, dep.dependentDocumentId);
        await this.documentRepository.addDependency(dependency);
        document.getDependencies().push(dependency);
      }
    }

    return document;
  }
}

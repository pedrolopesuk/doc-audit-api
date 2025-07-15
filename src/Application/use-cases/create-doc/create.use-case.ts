import { Injectable } from '@nestjs/common';
import { Document } from '../../../Domain/document/doc.entity';
import { Dependency } from '../../../Domain/dependency/dependency.entity';
import { IDocumentRepository } from '../../interfaces/document-repository.interface';
import { IEstablishmentRepository } from '../../interfaces/establishment-repository.interface';
import { CreateDocumentInput } from '../../interfaces/create-document.input';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly establishmentRepository: IEstablishmentRepository,
  ) {}

  async execute(input: CreateDocumentInput): Promise<Document> {
    const {
      name,
      type,
      issuanceFee,
      description,
      number,
      issueDate,
      expirationDate,
      establishmentId,
      dependencies,
    } = input;

    // Validar campos obrigatórios
    if (!establishmentId) {
      throw new Error('O ID do estabelecimento é obrigatório.');
    }

    if (expirationDate <= issueDate) {
      throw new Error(
        'A data de vencimento deve ser posterior à data de emissão.',
      );
    }

    // Verificar se o estabelecimento existe
    const exists =
      await this.establishmentRepository.getEstablishmentById(establishmentId);
    if (!exists) {
      throw new Error('Estabelecimento não encontrado.');
    }

    // Criar instância de documento
    const document = new Document(
      randomUUID(), // será atribuído pelo repositório
      name,
      type,
      issuanceFee,
      description ?? null,
      number ?? null,
      issueDate,
      expirationDate,
      establishmentId,
    );

    // Persistir o documento
    const created = await this.documentRepository.create(document);

    // Criar dependências, se houver
    if (dependencies && dependencies.length > 0) {
      for (const dep of dependencies) {
        const dependency = new Dependency(
          randomUUID(),
          created.id,
          dep.dependentDocumentId,
          dep.type ?? 'reference',
        );
        await this.documentRepository.addDependency(dependency);
      }
    }

    return created;
  }
}

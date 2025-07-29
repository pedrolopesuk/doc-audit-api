import { Injectable } from '@nestjs/common';
import { Document } from '../../../Domain/document/doc.entity';
import { documentDependency } from '../../../Domain/documentDependency/documentDependency.entity';
import { IDocumentRepository } from '../../interfaces/document-repository.interface';
import { IEstablishmentRepository } from '../../interfaces/establishment-repository.interface';

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
      fee,
      issueDate,
      expirationDate,
      establishmentDate,
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
      name,
      type,
      issuanceFee,
      description ?? null,
      fee,
      issueDate,
      expirationDate,
      establishmentDate,
      establishmentId,
      dependencies ?? [],
    );

    // Persistir o documento
    const created = await this.documentRepository.create(document);

    // Criar dependências, se houver
    if (dependencies && dependencies.length > 0) {
      for (const dep of dependencies) {
        const dependency = new documentDependency(
          document.getId(),
          dep.type ?? 'reference',
          dep.documentId,
        );
        await this.documentRepository.addDependency(dependency);
      }
    }

    return created;
  }
}
interface CreateDocumentInput {
  name: string;
  type: string;
  issuanceFee: string;
  description?: string | null;
  fee: number | null;
  issueDate: Date;
  expirationDate: Date;
  establishmentDate: Date;
  establishmentId: string;
  dependencies?: documentDependency[];
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IDocumentRepository } from '../../../Application/interfaces/document-repository.interface';
import { Document } from '../../../Domain/document/doc.entity';
import { documentDependency } from '../../../Domain/documentDependency/documentDependency.entity';

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(document: Document): Promise<Document> {
    const created = await this.prisma.documento.create({
      data: {
        name: document.getName(),
        type: document.getType(),
        issuanceFee: document.getIssuanceFee(),
        description: document.getDescription(),
        fee: document.getFee(),
        issueDate: document.getIssueDate(),
        validate: document.getExpirationDate(),
        establishmentDate: document.getEstablishmentDate(),
        establishmentId: document.getEstablishmentId(),
      },
    });

    return new Document(
      created.id,
      created.name,
      created.type,
      created.issuanceFee,
      created.descricao,
      created.fee,
      created.dataEmissao,
      created.validade,
      created.establishmentDate,
      created.estabelecimentoId,
    );
  }

  async addDependency(dependency: documentDependency): Promise<void> {
    await this.prisma.dependencia.create({
      data: {
        documentoId: dependency.documentId,
        dependeDeId: dependency.dependentDocumentId,
        tipo: dependency.type,
      },
    });
  }

  async getEstablishmentById(establishmentId: string): Promise<Document[]> {
    const documentos = await this.prisma.documento.findMany({
      where: { estabelecimentoId: establishmentId },
    });

    return documentos.map(
      (doc) =>
        new Document(
          doc.id,
          doc.name,
          doc.type,
          doc.issuanceFee,
          doc.descricao,
          doc.fee,
          doc.dataEmissao,
          doc.validade,
          doc.establishmentDate,
          doc.estabelecimentoId,
        ),
    );
  }
}

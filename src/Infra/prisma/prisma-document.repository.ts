import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IDocumentRepository } from '../../Application/interfaces/document-repository.interface';
import { Document } from '../../Domain/document/doc.entity';
import { Dependency } from '../../Domain/dependency/dependency.entity';

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<Document> {
    const created = await this.prisma.document.create({
      data: {
        name: document.getName(),
        type: document.getType(),
        descripton: document.getDescription(),
        issueDate: document.getIssueDate(),
        expirationDate: document.getExpirationDate(),
        establishmentId: document.getEstablishmentId(),
        dependencies: document.getDependencies().map((dep) => ({
          documentId: document.getId(),
          dependentDocumentId: dep.dependentDocumentId,
          type: dep.type,
        })),
      },
    });

    return new Document(
      created.name,
      created.type,
      created.description,
      created.issueDate,
      created.expirationDate,
      created.establishmentId,
      created.dependencies.map(
        (dep) =>
          new Dependency(dep.documentId, dep.dependentDocumentId, dep.type),
      ),
    );
  }

  async addDependency(dependency: Dependency): Promise<void> {
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
          doc.nome,
          doc.tipo,
          doc.taxaEmissao,
          doc.descricao,
          doc.numero,
          doc.dataEmissao,
          doc.validade,
          doc.estabelecimentoId,
        ),
    );
  }

  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!document) {
      return null;
    }

    return new Document(
      document.id,
      document.nome,
      document.tipo,
      document.taxaEmissao,
      document.descricao,
      document.numero,
      document.dataEmissao,
      document.validade,
      document.estabelecimentoId,
    );
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.documento.findMany({
      orderBy: { dataEmissao: 'desc' },
    });

    return documents.map(
      (doc) =>
        new Document(
          doc.id,
          doc.nome,
          doc.tipo,
          doc.taxaEmissao,
          doc.descricao,
          doc.numero,
          doc.dataEmissao,
          doc.validade,
          doc.estabelecimentoId,
        ),
    );
  }
}

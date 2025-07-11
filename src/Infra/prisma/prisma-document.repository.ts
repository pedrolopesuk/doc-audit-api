import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma'; // seu serviço Prisma
import { IDocumentRepository } from '../../Application/interfaces/document-repository.interface';
import { Document } from '../../Domain/document/doc.entity';
import { Dependency } from '../../Domain/dependency/dependency.entity';

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<Document> {
    const created = await this.prisma.documento.create({
      data: {
        nome: document.name,
        tipo: document.type,
        descricao: document.description,
        numero: document.number,
        dataEmissao: document.issueDate,
        validade: document.expirationDate,
        taxaEmissao: document.issuanceFee,
        estabelecimentoId: document.establishmentId,
      },
    });

    return new Document(
      created.id,
      created.nome,
      created.tipo,
      created.taxaEmissao,
      created.descricao,
      created.numero,
      created.dataEmissao,
      created.validade,
      created.estabelecimentoId,
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

  async getEstablishmentById(establishmentId: number): Promise<Document[]> {
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
}

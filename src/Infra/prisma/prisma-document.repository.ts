import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IDocumentRepository } from '../../Application/interfaces/document-repository.interface';
import { Document } from '../../Domain/document/doc.entity';
import { Dependency } from '../../Domain/dependency/dependency.entity';
import { DocumentTypeEnum } from '../../Domain/document/doctype.enum';

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<Document> {
    const created = await this.prisma.document.create({
      data: {
        name: document.getName(),
        type: document.getType(),
        description: document.getDescription(),
        issueDate: document.getIssueDate(),
        expirationDate: document.getExpirationDate(),
        establishmentId: document.getEstablishmentId(),
        dependencies: {
          create: document.getDependencies().map((dep) => ({
            dependsOn: {
              connect: { id: dep.dependentDocumentId },
            },
          })),
        },
      },
      include: {
        dependencies: true,
      },
    });
    return new Document(
      created.id,
      created.name,
      created.type as DocumentTypeEnum,
      created.description,
      created.issueDate,
      created.expirationDate,
      created.establishmentId,
    );
  }

  async addDependency(documentId: string, dependsOnId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1) valida doc dono[]
      console.log('id procurado', documentId);
      const doc = await tx.document.findUnique({
        where: { id: documentId },
        select: { id: true },
      });
      if (!doc) {
        throw new NotFoundException(`Documento ${documentId} não existe.`);
      }

      // 2) valida doc requisito
      if (!documentId) {
        throw new BadRequestException('dependsOnId é obrigatório.');
      }
      if (dependsOnId === documentId) {
        throw new BadRequestException(
          'Um documento não pode depender de si mesmo.',
        );
      }

      // 3) cria a dependência (idempotente por conta do @@unique)
      await tx.dependency.upsert({
        where: {
          // usa a constraint composta criada pelo @@unique([documentId, dependsOnId])
          documentId_dependsOnId: { documentId, dependsOnId },
        },
        update: {}, // nada a atualizar se já existir
        create: { documentId, dependsOnId },
      });
    });
  }

  async getEstablishmentById(establishmentId: string): Promise<Document[]> {
    const documentos = await this.prisma.document.findMany({
      where: { establishmentId: establishmentId },
      include: { dependencies: true },
    });

    return documentos.map((doc) => {
      const dependencies = (doc.dependencies || []).map(
        (dep: any) => new Dependency(doc.id, dep.dependsOnId),
      );
      const docEntity = new Document(
        doc.id,
        doc.name,
        doc.type as DocumentTypeEnum,
        doc.description,
        doc.issueDate,
        doc.expirationDate,
        doc.establishmentId,
      );
      docEntity.setDependencies(dependencies);
      return docEntity;
    });
  }

  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { dependencies: true },
    });

    if (!document) {
      return null;
    }

    // Mapeia as dependências para instâncias de Dependency
    const dependencies = (document.dependencies || []).map(
      (dep: any) => new Dependency(document.id, dep.dependsOnId),
    );
    const docEntity = new Document(
      document.id,
      document.name,
      document.type as DocumentTypeEnum,
      document.description,
      document.issueDate,
      document.expirationDate,
      document.establishmentId,
    );
    docEntity.setDependencies(dependencies);
    return docEntity;
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      orderBy: { issueDate: 'desc' },
      include: { dependencies: true },
    });

    return documents.map((doc) => {
      const dependencies = (doc.dependencies || []).map(
        (dep: any) => new Dependency(doc.id, dep.dependsOnId),
      );
      const docEntity = new Document(
        doc.id,
        doc.name,
        doc.type as DocumentTypeEnum,
        doc.description,
        doc.issueDate,
        doc.expirationDate,
        doc.establishmentId,
      );
      docEntity.setDependencies(dependencies);
      return docEntity;
    });
  }
}

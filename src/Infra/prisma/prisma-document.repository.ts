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
      created.name,
      created.type as DocumentTypeEnum,
      created.description,
      created.issueDate,
      created.expirationDate,
      created.establishmentId,
    );
  }

  async addDependency(
    dependency: { dependsOnId: string } | { dependentDocumentId: string },
    documentId: string,
  ): Promise<void> {
    // aceita ambos os nomes e normaliza
    const dependsOnId =
      (dependency as any).dependsOnId ??
      (dependency as any).dependentDocumentId;

    await this.prisma.$transaction(async (tx) => {
      // 1) valida doc dono
      const doc = await tx.document.findUnique({
        where: { id: documentId },
        select: { id: true },
      });
      if (!doc) {
        throw new NotFoundException(`Documento ${documentId} não existe.`);
      }

      // 2) valida doc requisito
      if (!dependsOnId) {
        throw new BadRequestException('dependsOnId é obrigatório.');
      }
      if (dependsOnId === documentId) {
        throw new BadRequestException(
          'Um documento não pode depender de si mesmo.',
        );
      }

      const req = await tx.document.findUnique({
        where: { id: dependsOnId },
        select: { id: true },
      });
      if (!req) {
        throw new NotFoundException(
          `Documento dependente ${dependsOnId} não existe.`,
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

    return documentos.map(
      (doc) =>
        new Document(
          doc.name,
          doc.type as DocumentTypeEnum,
          doc.description,
          doc.issueDate,
          doc.expirationDate,
          doc.establishmentId,
        ),
    );
  }

  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { dependencies: true },
    });

    if (!document) {
      return null;
    }

    return new Document(
      document.name,
      document.type as DocumentTypeEnum,
      document.description,
      document.issueDate,
      document.expirationDate,
      document.establishmentId,
    );
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      orderBy: { issueDate: 'desc' },
      include: { dependencies: true },
    });

    return documents.map(
      (doc) =>
        new Document(
          doc.name,
          doc.type as DocumentTypeEnum,
          doc.description,
          doc.issueDate,
          doc.expirationDate,
          doc.establishmentId,
        ),
    );
  }
}

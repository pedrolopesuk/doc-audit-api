import { Injectable } from '@nestjs/common';
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
      created.dependencies.map(
        (dep) => new Dependency(dep.documentId, dep.dependsOnId),
      ),
    );
  }

  async addDependency(dependency: Dependency): Promise<void> {
    await this.prisma.dependency.create({
      data: {
        documentId: dependency.documentId,
        dependsOnId: dependency.dependentDocumentId,
      },
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
          doc.dependencies.map(
            (dep) => new Dependency(dep.documentId, dep.dependsOnId),
          ),
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
      document.dependencies.map(
        (dep) => new Dependency(dep.documentId, dep.dependsOnId),
      ),
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
          doc.dependencies.map(
            (dep) => new Dependency(dep.documentId, dep.dependsOnId),
          ),
        ),
    );
  }
}

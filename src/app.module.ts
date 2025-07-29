import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentController } from './Http/controllers/document.controller';
import { CreateDocumentUseCase } from './Application/use-cases/create-doc/create.use-case';
import { PrismaService } from './Infra/prisma/prisma.service';
import { PrismaDocumentRepository } from './Infra/prisma/repositories/prisma-document.repository';
import { IDocumentRepository } from './Application/interfaces/document-repository.interface';

@Module({
  imports: [],
  controllers: [AppController, DocumentController],
  providers: [
    AppService,
    CreateDocumentUseCase,
    PrismaService,
    PrismaDocumentRepository,
    {
      provide: 'IDocumentRepository',
      useClass: PrismaDocumentRepository,
    },
  ],
})
export class AppModule {}

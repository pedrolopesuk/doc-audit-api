import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './Infra/prisma/prisma.service';
import { PrismaDocumentRepository } from './Infra/prisma/prisma-document.repository';
import { PrismaEstablishmentRepository } from './Infra/prisma/prisma-establishment.repository';
import { CreateDocumentUseCase } from './Application/use-cases/create-doc/create.use-case';
import { DocumentsController } from './controllers/documents.controller';
import { EstablishmentsController } from './controllers/establishments.controller';
import { FeesController } from './controllers/fees.controller';
import { FeeJsonReaderService } from './Infra/services/fee-json-reader.service';
import { ImportFeesUseCase } from './Application/use-cases/read-fees/import-fees.use-case';

@Module({
  imports: [],
  controllers: [
    AppController,
    DocumentsController,
    EstablishmentsController,
    FeesController,
  ],
  providers: [
    AppService,
    PrismaService,
    PrismaDocumentRepository,
    PrismaEstablishmentRepository,
    CreateDocumentUseCase,
    {
      provide: 'IDocumentRepository',
      useClass: PrismaDocumentRepository,
    },
    {
      provide: 'IEstablishmentRepository',
      useClass: PrismaEstablishmentRepository,
    },
    FeeJsonReaderService,
    ImportFeesUseCase,
  ],
})
export class AppModule {}

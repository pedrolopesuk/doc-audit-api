import { Document } from '../../Domain/document/doc.entity';
import { Dependency } from '../../Domain/dependency/dependency.entity';

export interface IDocumentRepository {
  create(document: Document): Promise<Document>;
  addDependency(dependency: Dependency): Promise<void>;
  getEstablishmentById(establishmentId: number): Promise<Document[]>;
}

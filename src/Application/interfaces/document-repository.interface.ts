import { Document } from '../../Domain/document/doc.entity';
import { documentDependency } from '../../Domain/documentDependency/documentDependency.entity';

export interface IDocumentRepository {
  create(document: Document): Promise<Document>;
  addDependency(dependency: documentDependency): Promise<void>;
  getEstablishmentById(estabelecimentoId: string): Promise<Document[]>;
}

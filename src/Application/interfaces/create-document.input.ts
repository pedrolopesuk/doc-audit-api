import { DocumentFee } from 'src/Domain/document/docfee.entity';
import { DocumentTypeEnum } from 'src/Domain/document/doctype.enum';

export interface CreateDocumentInput {
  id: string;
  name: string;
  type: DocumentTypeEnum;
  description?: string | null;
  issueDate: Date;
  expirationDate: Date;
  establishmentId: string;
  dependencies?: DependencyInput[];
  documentFees?: {
    documentId: string;
    fees: Map<string, number>;
  }[];
}

interface DependencyInput {
  dependentDocumentId: string;
}

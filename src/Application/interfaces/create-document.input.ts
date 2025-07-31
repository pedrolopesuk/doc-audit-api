import { DocumentFee } from 'src/Domain/document/docfee.entity';

export interface CreateDocumentInput {
  name: string;
  type: DocumentType;
  description?: string | null;
  issueDate: Date;
  expirationDate: Date;
  establishmentId: string;
  dependencies?: {
    dependentDocumentId: string;
  }[];
  documentFees?: {
    documentId: string;
    fees: Map<string, number>;
  }[];
}

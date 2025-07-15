export interface CreateDocumentInput {
  name: string;
  type: string;
  issuanceFee: string;
  description?: string | null;
  number?: string | null;
  issueDate: Date;
  expirationDate: Date;
  establishmentId: string;
  dependencies?: {
    dependentDocumentId: string;
    type?: string;
  }[];
}

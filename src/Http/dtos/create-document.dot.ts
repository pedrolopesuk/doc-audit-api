import { documentDependency } from 'src/Domain/documentDependency/documentDependency.entity';

export class CreateDocumentDto {
  name: string;
  type: string;
  issuanceFee: string;
  description: string | null;
  fee: number | null; // issue fee / renew fee
  issueDate: Date;
  expirationDate: Date;
  establishmentDate: Date;
  establishmentId: string;
  dependencies?: documentDependency[];
}

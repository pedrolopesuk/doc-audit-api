import { Document } from 'src/Domain/document/doc.entity';
import { DocumentResponseDto } from '../dtos/response-document.dto';
import { DocumentType } from '../../Domain/document/doctype.enum';

export function toDocumentResponseDto(document: Document): DocumentResponseDto {
  return {
    id: document.getId(),
    name: document.getName(),
    type: document.getType() as unknown as DocumentType, // mudar isso!!
    description: document.getDescription(),
    issueDate: document.getIssueDate(),
    expirationDate: document.getExpirationDate(),
    establishmentId: document.getEstablishmentId(),
    dependencies: document.getDependencies().map((d) => d.dependentDocumentId),
    documentFees: Object.fromEntries(
      document
        .getDocumentFees()
        .flatMap((fee) => Array.from(fee.fees.entries())),
    ),
  };
}

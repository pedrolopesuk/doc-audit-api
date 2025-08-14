import { Document } from 'src/Domain/document/doc.entity';
import { DocumentResponseDto } from '../dtos/response-document.dto';

export function toDocumentResponseDto(document: Document): DocumentResponseDto {
  const allFees = {};
  document.getDocumentFees().forEach((value, key) => {
    allFees[key] = value;
  });

  return {
    id: document.getId(),
    name: document.getName(),
    type: document.getType(),
    description: document.getDescription(),
    issueDate: document.getIssueDate(),
    expirationDate: document.getExpirationDate(),
    establishmentId: document.getEstablishmentId(),
    dependencies: document.getDependencies().map((d) => d.dependentDocumentId),
    documentFees: allFees,
  };
}

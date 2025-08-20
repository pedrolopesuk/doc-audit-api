import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEnum } from '../../Domain/document/doctype.enum';

export class DocumentResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentTypeEnum;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  establishmentId: string;

  @ApiProperty({ type: [String] })
  dependencies: string[]; // ou array de IDs ou objetos, conforme desejar

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  documentFees: Record<string, string>; // simples para leitura
}

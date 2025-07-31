import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../Domain/document/doctype.enum';

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentType;

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
  documentFees: Record<string, number>; // simples para leitura
}

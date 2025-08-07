import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentTypeEnum } from 'src/Domain/document/doctype.enum';

export class CreateDependencyDto {
  @IsUUID()
  @IsNotEmpty()
  dependentDocumentId: string;

  @IsString()
  @IsOptional()
  type?: string;
}

class FeeInput {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  amount: number;
}

class DependencyInput {
  @IsUUID()
  documentId: string;
  @IsUUID()
  dependentDocumentId: string;
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DocumentTypeEnum)
  type: DocumentTypeEnum;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsUUID()
  establishmentId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DependencyInput)
  dependencies?: DependencyInput[];
}

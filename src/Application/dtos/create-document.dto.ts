import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDependencyDto {
  @IsUUID()
  @IsNotEmpty()
  dependentDocumentId: string;

  @IsString()
  @IsOptional()
  type?: string;
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  issuanceFee: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;

  @IsUUID()
  @IsNotEmpty()
  establishmentId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDependencyDto)
  dependencies?: CreateDependencyDto[];
}

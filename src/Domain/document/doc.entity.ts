import { Dependency } from '../dependency/dependency.entity';
import { DocumentTypeEnum } from './doctype.enum';

export class Document {
  private _id: string;
  private _name: string;
  private _type: DocumentTypeEnum;
  private _issueDate: Date;
  private _description: string | null;
  private _expirationDate: Date;
  private _establishmentId: string;
  private _dependencies: Dependency[];
  private _documentFees: Map<string, string>;

  constructor(
    id: string,
    name: string,
    type: DocumentTypeEnum,
    description: string | null,
    issueDate: Date,
    expirationDate: Date,
    establishmentId: string,
  ) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._description = description;
    this._issueDate = issueDate;
    this._expirationDate = expirationDate;
    this._establishmentId = establishmentId;
    this._dependencies = [];
    this._documentFees = new Map<string, string>();
  }

  isExpired(reference: Date = new Date()): boolean {
    return this.getExpirationDate() < reference;
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this._name;
  }

  getType(): DocumentTypeEnum {
    return this._type;
  }

  getIssueDate(): Date {
    return this._issueDate;
  }

  getDescription(): string | null {
    return this._description;
  }

  getExpirationDate(): Date {
    return this._expirationDate;
  }

  getEstablishmentId(): string {
    return this._establishmentId;
  }

  getDependencies(): Dependency[] {
    return this._dependencies;
  }

  getDocumentFees(): Map<string, string> {
    return this._documentFees;
  }

  setName(name: string): void {
    this._name = name;
  }

  setType(type: DocumentTypeEnum): void {
    this._type = type;
  }

  setDescription(description: string | null): void {
    this._description = description;
  }

  setIssueDate(issueDate: Date): void {
    this._issueDate = issueDate;
  }

  setExpirationDate(expirationDate: Date): void {
    this._expirationDate = expirationDate;
  }

  setEstablishmentId(establishmentId: string): void {
    this._establishmentId = establishmentId;
  }

  setDependencies(dependencies: Dependency[]): void {
    this._dependencies = dependencies;
  }

  setDocumentFees(documentFees: Map<string, string>): void {
    this._documentFees = documentFees;
  }

  addDocumentFee(fees: Map<string, string>): void {
    fees.forEach((value, key) => {
      this._documentFees.set(key, value);
    });
  }

  addDependency(dependency: Dependency): void {
    this._dependencies.push(dependency);
  }
}

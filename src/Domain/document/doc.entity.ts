import { randomUUID } from 'crypto';
import { documentDependency } from '../../Domain/documentDependency/documentDependency.entity';

export class Document {
  private _id: string;
  private _name: string;
  private _type: string;
  private _issueanceFee: string;
  private _description: string | null;
  private _fee: number | null;
  private _issueDate: Date;
  private _expirationDate: Date;
  private _establishmentDate: Date;
  private _establishmentId: string;
  private _dependencies: documentDependency[] = [];

  constructor(
    name: string,
    type: string,
    issuanceFee: string,
    description: string | null,
    fee: number | null, // issue fee / renew fee
    issueDate: Date,
    expirationDate: Date,
    establishmentDate: Date,
    establishmentId: string,
    dependencies?: documentDependency[],
  ) {
    this._id = randomUUID();
    this._name = name;
    this._type = type;
    this._issueanceFee = issuanceFee;
    this._description = description;
    this._fee = fee;
    this._issueDate = issueDate;
    this._expirationDate = expirationDate;
    this._establishmentDate = establishmentDate;
    this._establishmentId = establishmentId;
    this._dependencies = dependencies || [];
  }

  addDependency(dependency: documentDependency): void {
    this._dependencies.push(dependency);
  }

  removeDependency(dependencyId: string): void {
    this._dependencies = this._dependencies.filter(
      (dep) => dep.getDependentDocumentId() !== dependencyId,
    );
  }

  isExpired(reference: Date = new Date()): boolean {
    return this._expirationDate < reference;
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this._name;
  }

  getType(): string {
    return this._type;
  }

  getIssuanceFee(): string {
    return this._issueanceFee;
  }

  getDescription(): string | null {
    return this._description;
  }

  getFee(): number | null {
    return this._fee;
  }

  getIssueDate(): Date {
    return this._issueDate;
  }

  getExpirationDate(): Date {
    return this._expirationDate;
  }

  getEstablishmentDate(): Date {
    return this._establishmentDate;
  }

  getEstablishmentId(): string {
    return this._establishmentId;
  }

  getDependencies(): documentDependency[] {
    return this._dependencies;
  }

  setName(name: string): void {
    if (!name) {
      throw new Error('O campo name é obrigatório.');
    }
    this._name = name;
  }

  setType(type: string): void {
    if (!type) {
      throw new Error('O campo type é obrigatório.');
    }
    this._type = type;
  }

  setIssuanceFee(issuanceFee: string): void {
    if (!issuanceFee) {
      throw new Error('O campo issuanceFee é obrigatório.');
    }
    this._issueanceFee = issuanceFee;
  }

  setDescription(description: string | null): void {
    if (!description) {
      throw new Error('O campo description é obrigatório.');
    }

    this._description = description;
  }

  setFee(fee: number | null): void {
    if (fee === null) {
      throw new Error('O campo fee não pode ser nulo.');
    }

    if (fee <= 0) {
      throw new Error('Fee deve ser maior que zero.');
    }

    this._fee = fee;
  }

  setIssueDate(issueDate: Date): void {
    if (!issueDate) {
      throw new Error('O campo issueDate é obrigatório.');
    }

    this._issueDate = issueDate;
  }

  setExpirationDate(expirationDate: Date): void {
    if (!expirationDate) {
      throw new Error('O campo expirationDate é obrigatório.');
    }

    this._expirationDate = expirationDate;
  }

  setEstablishmentDate(establishmentDate: Date): void {
    if (!establishmentDate) {
      throw new Error('O campo establishmentDate é obrigatório.');
    }

    this._establishmentDate = establishmentDate;
  }

  setEstablishmentId(establishmentId: string): void {
    if (!establishmentId) {
      throw new Error('O campo establishmentId é obrigatório.');
    }

    this._establishmentId = establishmentId;
  }
}

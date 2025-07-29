import { randomUUID } from 'crypto';

export class documentDependency {
  private _id: string;
  private _documentId: string;
  private _dependentDocumentId: string;
  private _type: string; // ex: 'reference', 'legal', etc

  constructor(
    public documentId: string,
    public dependentDocumentId: string,
    public type: string, // ex: 'reference', 'legal', etc
  ) {
    this._id = randomUUID();
    this._documentId = documentId;
    this._dependentDocumentId = dependentDocumentId;
    this._type = type;
  }

  getId(): string {
    return this._id;
  }

  getDocumentId(): string {
    return this._documentId;
  }

  getDependentDocumentId(): string {
    return this._dependentDocumentId;
  }

  getType(): string {
    return this._type;
  }

  setType(type: string): void {
    this._type = type;
  }

  setDocumentId(documentId: string): void {
    if (!documentId) {
      throw new Error('O campo documentId é obrigatório.');
    }
    if (documentId === this._documentId) {
      throw new Error('Um documento não pode depender de si mesmo.');
    }
    this._documentId = documentId;
  }

  setDependentDocumentId(dependentDocumentId: string): void {
    if (!dependentDocumentId) {
      throw new Error('O campo dependentDocumentId é obrigatório.');
    }

    this._dependentDocumentId = dependentDocumentId;
  }
}

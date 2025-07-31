import { randomUUID } from 'crypto';

export class Dependency {
  _id: string;
  _documentId: string;
  _dependentDocumentId: string;

  constructor(
    public readonly documentId: string,
    public readonly dependentDocumentId: string,
  ) {
    this._id = randomUUID();
    this._documentId = documentId;
    this._dependentDocumentId = dependentDocumentId;
  }

  mesmaDependenciaOutro(): boolean {
    return this.documentId === this.dependentDocumentId;
  }
}

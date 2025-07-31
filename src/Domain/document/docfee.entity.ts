import { randomUUID } from 'crypto';

export class DocumentFee {
  _id: string;
  _documentId: string;
  _fees: Map<string, number>;

  constructor(
    public documentId: string,
    public fees: Map<string, number>,
  ) {
    this._id = randomUUID();
    this._documentId = documentId;
    this._fees = fees || new Map<string, number>();
  }
}
